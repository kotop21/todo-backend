import { db } from "../../index-database.js";
import crypto from "crypto";

export const createRefreshToken = async () => {
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const refreshTokenExpiresAt = new Date(new Date().setDate(new Date().getDate() + 30));

  return {
    refreshToken,
    hashedToken,
    refreshTokenExpiresAt,
  };
};

export const updateRefreshToken = async (userIdIn?: number) => {
  try {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const refreshTokenExpiresAt = new Date(new Date().setDate(new Date().getDate() + 30));

    if (userIdIn) {
      await db.user.update({
        where: { id: userIdIn },
        data: {
          refreshToken: hashedToken,
          refreshTokenExpiresAt,
        },
      });
    }

    return {
      message: "Refresh Token has been created",
      refreshToken,
      hashedToken,
      refreshTokenExpiresAt,
    };
  } catch (err: any) {
    console.error("Error updating User Refresh Token:", err);
    const error: any = new Error("Failed to update User Refresh Token");
    error.statusCode = 400;
    throw error;
  }
};

export const verifyRefreshToken = (refreshToken: string, hashedToken: string): boolean => {
  const hashedInput = crypto.createHash("sha256").update(refreshToken).digest("hex");
  return hashedInput === hashedToken;
};
