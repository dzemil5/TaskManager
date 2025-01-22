import prisma from "../models/userModel";

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};
