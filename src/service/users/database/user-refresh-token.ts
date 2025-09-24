import { db } from "./index-database.js";
import crypto from "crypto";

export const createRefreshToken = async (userId?: number) => {
  try {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const refreshTokenExpiresAt = new Date(new Date().setDate(new Date().getDate() + 30));

    if (userId) {
      await db.user.update({
        where: { id: userId },
        data: {
          refreshToken: hashedToken,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
        },
      });
    }

    return {
      message: "Refresh Token has bin created",
      refreshToken: refreshToken,
      hashedToken: hashedToken,
      refreshTokenExpiresAt: refreshTokenExpiresAt,
    };
  } catch (err: any) {
    throw err;
  }
};
