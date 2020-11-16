import { PrismaClient } from "@prisma/client";
import { Request } from "express";

export interface Signup {
  args: {
    data: {
      name: string;
      lastname: string;
      email: string;
      password: string;
      photo?: string;
    };
  };
}
export interface Context {
  req: Request;
  prisma: PrismaClient;
}
export interface Login {
  email: string;
  password: string;
}

export interface ResetPassword {
  password: string;
  resetToken: string;
}
