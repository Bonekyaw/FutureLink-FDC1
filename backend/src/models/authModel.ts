import prisma from "../lib/prisma";

export const findUserByPhone = async (phone: string) => {
  return await prisma.user.findUnique({
    where: {
      phone,
    },
  });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const updateUserById = async (id: number, data: any) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

export const findOTPbyPhone = async (phone: string) => {
  return await prisma.otp.findUnique({
    where: {
      phone,
    },
  });
};

export const createOTP = async (data: any) => {
  return await prisma.otp.create({ data });
};

export const updateOTP = async (id: number, data: any) => {
  return await prisma.otp.update({
    where: {
      id,
    },
    data,
  });
};
