import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

const red = "\x1b[31m";
const gray = "\x1b[90m";
const reset = "\x1b[0m";

const getTimeStamp = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `[${hours}:${minutes}:${seconds}]`;
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = `${gray}${getTimeStamp()}${reset}`;

  if (err instanceof ZodError) {
    console.error(
      `${timestamp} ${red}❌ Validation error:${reset} ${JSON.stringify(
        err.issues,
        null,
        2
      )}`
    );
  } else {
    console.error(
      `${timestamp} ${red}❌ Error:${reset} ${err.message} (status: ${err.statusCode || 500
      })`
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
