import { db } from "./index-database.js";
import crypto from "crypto";

export const createSession = async (userID: number) => {
  try {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await db.session.create({
      data: {
        userId: userID,
        refreshToken: hashedToken,
        createdAt: new Date(),
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
    });

    return {
      message: "Session created successfully",
      refreshToken: refreshToken,
      expiresAt: session.expiresAt,
    };
  } catch (err: any) {
    throw err;
  }
};
