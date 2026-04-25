import { PrismaClient } from "@prisma/client";
import { generateAccessToken, generateRefreshToken, JwtPayload } from "./jwt";
import { hashPassword, verifyPassword } from "./password";

const prisma = new PrismaClient();

export async function registerUser(email: string, password: string, name: string, areaId: number, rol: 'admin' | 'supervisor' | 'staff' = 'staff') {
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      areaId, 
      rol,
    },
  });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const payload: JwtPayload = { userId: user.id, email: user.email, rol: user.rol };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken, user };
}