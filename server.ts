
import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// ═══════════════════════════════════════════════════════════
// RATE LIMITER
// ═══════════════════════════════════════════════════════════

const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(req: Request): string {
  return req.ip || 'unknown';
}

function checkRateLimit(req: Request, maxRequests = 30, windowMs = 60000): boolean {
  const key = getRateLimitKey(req);
  const now = Date.now();
  const data = requestCounts.get(key);

  if (!data || now > data.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (data.count < maxRequests) {
    data.count++;
    return true;
  }

  return false;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[SYS] Warning: GEMINI_API_KEY is not defined in the environment.");
  }

  const ai = new GoogleGenAI({ 
    apiKey: apiKey || "dummy-key-to-prevent-sdk-error-on-init",
  });

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // Chat API with rate limiting
  app.post("/api/lilly/chat", async (req: Request, res: Response) => {
    try {
      // Rate limiting
      if (!checkRateLimit(req, 30, 60000)) {
        return res.status(429).json({ 
          error: "Too many requests. Please wait before trying again.",
          retryAfter: 60
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(401).json({ 
          error: "GEMINI_API_KEY is missing on the server. Please set it in Settings > Secrets.",
          code: "AUTH_MISSING"
        });
      }

      const { history, systemInstruction } = req.body;
      
      // Validate input
      if (!history || !Array.isArray(history)) {
        return res.status(400).json({ 
          error: "Invalid request: 'history' must be an array",
          code: "INVALID_INPUT"
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: history,
        config: {
          systemInstruction: systemInstruction || "",
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
        },
      });

      // Validate response
      if (!response?.text) {
        console.warn("[Chat] Empty response from Gemini");
        return res.status(500).json({ 
          error: "No response generated",
          code: "EMPTY_RESPONSE"
        });
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("[Chat Error]:", error);
      
      const errStr = error?.message || String(error);
      const isQuota = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");
      const isAuth = errStr.includes("403") || errStr.includes("PERMISSION_DENIED") || errStr.includes("API_KEY_INVALID");
      const isNetwork = errStr.includes("ECONNREFUSED") || errStr.includes("ENOTFOUND");

      const statusCode = isQuota ? 429 : isAuth ? 403 : isNetwork ? 503 : 500;
      const errorMessage = isQuota 
        ? "Neural link quota exceeded"
        : isAuth 
        ? "Authentication failed with Gemini API"
        : isNetwork
        ? "Network connection failed"
        : "Neural link engine error";

      res.status(statusCode).json({ 
        error: errorMessage,
        code: isQuota ? "QUOTA_EXCEEDED" : isAuth ? "AUTH_ERROR" : isNetwork ? "NETWORK_ERROR" : "SERVER_ERROR",
        details: process.env.NODE_ENV === 'development' ? errStr : undefined
      });
    }
  });

  // Image Generation API with improved handling
  app.post("/api/lilly/generate-image", async (req: Request, res: Response) => {
    try {
      // Rate limiting (stricter for image generation)
      if (!checkRateLimit(req, 10, 60000)) {
        return res.status(429).json({ 
          error: "Image generation limit exceeded. Please wait before trying again.",
          retryAfter: 60
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(401).json({ 
          error: "GEMINI_API_KEY is missing on the server.",
          code: "AUTH_MISSING"
        });
      }

      let { prompt, aspectRatio = "1:1" } = req.body;
      
      // Validate prompt
      if (!prompt || typeof prompt !== 'string' || prompt.length < 10) {
        return res.status(400).json({ 
          error: "Prompt must be at least 10 characters",
          code: "INVALID_PROMPT"
        });
      }

      // Validate aspect ratio
      const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
      if (!validRatios.includes(aspectRatio)) {
        aspectRatio = "1:1";
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: "1K",
          },
        } as any,
      });

      let imageUrl = null;
      let text = "";

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if ((part as any).inlineData) {
            imageUrl = `data:image/png;base64,${(part as any).inlineData.data}`;
          } else if ((part as any).text) {
            text += (part as any).text;
          }
        }
      }

      if (!imageUrl) {
        return res.status(500).json({ 
          error: "Failed to generate image",
          code: "GENERATION_FAILED"
        });
      }

      res.json({ imageUrl, text });
    } catch (error: any) {
      console.error("[Image Generation Error]:", error);
      
      const errStr = error?.message || String(error);
      const isQuota = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");
      
      res.status(isQuota ? 429 : 500).json({ 
        error: "Image generation failed",
        code: isQuota ? "QUOTA_EXCEEDED" : "GENERATION_ERROR",
        details: process.env.NODE_ENV === 'development' ? errStr : undefined
      });
    }
  });

  // Health check API
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ 
      status: "ok",
      timestamp: new Date().toISOString(),
      apiKeyConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // API info endpoint
  app.get("/api/info", (req: Request, res: Response) => {
    res.json({
      name: "Lilly AI Engine",
      version: "2.1",
      features: ["chat", "image-generation", "memory", "tasks"],
      models: {
        chat: "gemini-2.0-flash",
        image: "gemini-2.0-flash"
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error("[Server Error]:", err);
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYS] ✓ Lilly Engine initialized.`);
    console.log(`[SYS] ✓ Server running on http://0.0.0.0:${PORT}`);
    console.log(`[SYS] ✓ Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[SYS] ✓ API Key: ${process.env.GEMINI_API_KEY ? 'configured' : 'NOT SET'}`);
  });
}

startServer().catch(err => {
  console.error("[FATAL] Failed to start Lilly Engine:", err);
  process.exit(1);
});
