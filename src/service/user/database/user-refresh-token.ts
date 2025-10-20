import { db } from "../../index-database.js";
import crypto from "crypto";

export const createRefreshToken = async () => {
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  return {
    refreshToken,
    hashedToken,
    refreshTokenExpiresAt,
  };
};

export const updateRefreshToken = async (userId: number) => {
  const { refreshToken, hashedToken, refreshTokenExpiresAt } = await createRefreshToken();

  await db.user.update({
    where: { id: userId },
    data: {
      refreshToken: hashedToken,
      refreshTokenExpiresAt,
    },
  });

  return {
    message: "Refresh token updated",
    refreshToken,
    refreshTokenExpiresAt,
  };
};

export const verifyRefreshToken = (refreshToken: string, hashedToken: string): boolean => {
  const hashedInput = crypto.createHash("sha256").update(refreshToken).digest("hex");
  return hashedInput === hashedToken;
};
