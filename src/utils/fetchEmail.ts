import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**Utility za vracanje korisnika po emailu (ukoliko je potrebno van UserService) */
export const fetchEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};
