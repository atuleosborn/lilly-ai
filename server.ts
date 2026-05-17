
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini on the server
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[SYS] Warning: GEMINI_API_KEY is not defined in the environment.");
  }

  const ai = new GoogleGenAI({ 
    apiKey: apiKey || "dummy-key-to-prevent-sdk-error-on-init",
    // We'll throw actual errors inside the routes if key is missing
  });

  // Chat API
  app.post("/api/lilly/chat", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(401).json({ error: "GEMINI_API_KEY is missing on the server. Please set it in Settings > Secrets." });
      }

      const { history, systemInstruction } = req.body;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("[Neural Link] Chat Error:", error);
      const errStr = error?.message || String(error);
      const isQuota = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");
      const isAuth = errStr.includes("403") || errStr.includes("PERMISSION_DENIED") || errStr.includes("API_KEY_INVALID");

      res.status(isQuota ? 429 : isAuth ? 403 : 503).json({ 
        error: isQuota ? "Neural link quota exceeded." : isAuth ? "Authentication failed with Gemini API." : "Neural link engine unstable.",
        details: errStr
      });
    }
  });

  // Image Generation API
  app.post("/api/lilly/generate-image", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(401).json({ error: "GEMINI_API_KEY is missing on the server." });
      }

      let { prompt, aspectRatio = "1:1" } = req.body;
      
      // Ensure aspect ratio is valid
      const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
      if (!validRatios.includes(aspectRatio)) {
        aspectRatio = "1:1";
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: "1K",
          },
        },
      });

      let imageUrl = null;
      let text = "";

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            text += part.text;
          }
        }
      }

      res.json({ imageUrl, text });
    } catch (error: any) {
      console.error("[Neural Link] Image Error:", error);
      const errStr = error?.message || String(error);
      const isQuota = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");
      
      res.status(isQuota ? 429 : 500).json({ 
        error: "Visual synthesis failure.",
        details: errStr
      });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYS] Lilly Engine initialized.`);
    console.log(`[SYS] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[SYS] Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error("[FATAL] Failed to start Lilly Engine:", err);
});
