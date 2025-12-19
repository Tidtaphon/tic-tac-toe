import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const plainPassword = "admin1234";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const adminExists = await prisma.user.findUnique({
    where: { email },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        email,
        name: "Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin seeded");
  } else {
    console.log("ℹ️ Admin already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
