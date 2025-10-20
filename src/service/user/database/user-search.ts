import { db } from "../../index-database.js";
import crypto from "crypto";

export const regSearchUserByEmail = async (email: string) => {
  if (!email) {
    const error: any = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    return await db.user.findFirst({
      where: { email },
    });
  } catch (err: any) {
    console.error("Error register search User by email:", err);
    if (err.statusCode) {
      throw err;
    }
    const error: any = new Error("Internal server error");
    error.statusCode = 500;
    throw error;
  }
}

export const searchUserByEmail = async (email: string) => {
  if (!email) {
    const error: any = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }
  try {
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
  } catch (err: any) {
    console.error("Error search User by email:", err);

    if (err.statusCode) {
      throw err;
    }

    const error: any = new Error("Internal server error");
    error.statusCode = 500;
    throw error;
  }
}

export const searchUserById = async (id: number) => {
  if (id === undefined || id === null) {
    const error: any = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }
  try {
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
  } catch (err: any) {
    console.error("Error search User by id:", err);
    if (err.statusCode) {
      throw err;
    }
    const error: any = new Error("Internal server error");
    error.statusCode = 500;
    throw error;
  }
}

export const searchRefreshToken = async (refreshTokenIn: string) => {
  if (!refreshTokenIn) {
    const error: any = new Error("Refresh token is required");
    error.statusCode = 400;
    throw error;
  }

  const hashedInput = crypto.createHash("sha256").update(refreshTokenIn).digest("hex");

  try {
    const user = await db.user.findFirst({
      where: { refreshToken: hashedInput },
      select: {
        id: true,
        email: true,
        refreshToken: true,
        refreshTokenExpiresAt: true,
        regDate: true,
      },
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user;
  } catch (err: any) {
    console.error("Error search User by refresh token:", err);
    if (err.statusCode) {
      throw err;
    }
    const error: any = new Error("Internal server error");
    error.statusCode = 500;
    throw error;
  }
};

