import { db } from "../../index-database.js";
import crypto from "crypto";

export const createRefreshToken = async (userIdIn?: number) => {
  try {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const refreshTokenExpiresAt = new Date(new Date().setDate(new Date().getDate() + 30));

    if (userIdIn) {
      await db.user.update({
        where: { id: userIdIn },
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

export const verifyRefreshToken = (refreshToken: string, hashedToken: string): boolean => {
  try {
    const hashedInput = crypto.createHash("sha256").update(refreshToken).digest("hex");
    return hashedInput === hashedToken;
  } catch (err: any) {
    throw err;
  }
};
