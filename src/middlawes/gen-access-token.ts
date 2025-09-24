import jwt from 'jsonwebtoken';

interface AccessTokenData {
  userID: number;
  email: string;
  createdAt: string;
}

export const generateAccessToken = (data: AccessTokenData) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in env");
  }

  // Время жизни AccessToken
  const expiresIn = '15m';

  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn,
  });

  return { token, expiresIn };
};
