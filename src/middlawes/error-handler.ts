import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

// ANSI escape codes для красного цвета
const red = "\x1b[31m";
const reset = "\x1b[0m";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    console.error(
      `${red}❌ Validation error:\n${reset} ${JSON.stringify(err.issues, null, 2)}`
    );
  } else {
    console.error(
      `${red}❌ Error:${reset} ${err.message} (status: ${err.statusCode || 500})`
    );
  }

  if (err instanceof ZodError) {
    const errors = err.issues.reduce((acc, curr) => {
      if (curr.path && curr.path[0]) {
        acc[curr.path[0] as string] = curr.message;
      }
      return acc;
    }, {} as Record<string, string>);

    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors,
      timestamp: new Date(),
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    status: "error",
    message,
    timestamp: new Date(),
  });
};
