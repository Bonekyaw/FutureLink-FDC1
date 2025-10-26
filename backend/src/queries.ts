// 1
import * as bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// 2
const prisma = new PrismaClient().$extends(withAccelerate());

// 3
async function main() {
  console.log("Start DB seeding....");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("12345678", salt);

  await prisma.user.create({
    data: {
      phone: "778661260",
      password: hashedPassword,
      randToken: "as23bsd8fwbfkihvsre43b",
    },
  });

  console.log("Seeding finished.");
}

// 4
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    // 5
    await prisma.$disconnect();
    process.exit(1);
  });
