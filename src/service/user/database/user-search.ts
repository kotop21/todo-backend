import { db } from "./index-database.js";
import crypto from "crypto";

export const regSearchUserByEmail = async (email: string) => {
  if (!email) {
    const error: any = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  return await db.user.findFirst({
    where: { email },
  });
};

export const searchUserByEmail = async (email: string) => {
  if (!email) {
    const error: any = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await db.user.findFirst({
    where: { email },
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    userid: user.id,
    email: user.email,
    password: user.password,
    regDate: user.regDate,
    refreshToken: user.refreshToken,
    refreshTokenExpiresAt: user.refreshTokenExpiresAt,
  };
};

export const searchUserById = async (id: number) => {
  if (id === undefined || id === null) {
    const error: any = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await db.user.findFirst({
    where: { id },
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    email: user.email,
    regDate: user.regDate,
    refreshToken: user.refreshToken,
    refreshTokenExpiresAt: user.refreshTokenExpiresAt,
  };
};


export const searchRefreshToken = async (refreshTokenIn: string) => {
  const hashedInput = crypto.createHash("sha256").update(refreshTokenIn).digest("hex");

  const user = await db.user.findFirst({
    where: {
      refreshToken: hashedInput,
    },
    select: { id: true },
  });

  if (!user) {
    const error: any = new Error("Refresh token not found or invalid");
    error.statusCode = 401;
    throw error;
  }

  return { id: user.id }
};