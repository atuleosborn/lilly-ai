/**
 * Logger — Structured logging with log levels
 * Controls verbosity via environment
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

export class Logger {
  private level: LogLevel;
  private namespace: string;

  constructor(namespace: string, level: LogLevel = LogLevel.INFO) {
    this.namespace = namespace;
    this.level = level;
  }

  debug(...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(`[${this.namespace}:DEBUG]`, ...args);
    }
  }

  info(...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`[${this.namespace}:INFO]`, ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[${this.namespace}:WARN]`, ...args);
    }
  }

  error(...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[${this.namespace}:ERROR]`, ...args);
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

export const createLogger = (namespace: string) => {
  const isDev = import.meta.env.DEV;
  return new Logger(namespace, isDev ? LogLevel.DEBUG : LogLevel.INFO);
};
