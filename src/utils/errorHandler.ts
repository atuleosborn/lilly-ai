/**
 * Error Handler — Centralized error processing
 * Categorizes and formats errors for display
 */

export interface ErrorInfo {
  message: string;
  code: string;
  isRetryable: boolean;
  userMessage: string;
  timestamp: number;
}

export class AppError extends Error {
  code: string;
  isRetryable: boolean;
  userMessage: string;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    isRetryable = false,
    userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.isRetryable = isRetryable;
    this.userMessage = userMessage || message;
  }

  toJSON(): ErrorInfo {
    return {
      message: this.message,
      code: this.code,
      isRetryable: this.isRetryable,
      userMessage: this.userMessage,
      timestamp: Date.now(),
    };
  }
}

export function parseError(error: unknown): ErrorInfo {
  if (error instanceof AppError) {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      isRetryable: false,
      userMessage: 'An unexpected error occurred',
      timestamp: Date.now(),
    };
  }

  return {
    message: String(error),
    code: 'UNKNOWN_ERROR',
    isRetryable: false,
    userMessage: 'An unexpected error occurred',
    timestamp: Date.now(),
  };
}

export function isRetryableError(error: unknown): boolean {
  const parsed = parseError(error);
  return parsed.isRetryable;
}
