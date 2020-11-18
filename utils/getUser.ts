import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";

export const getUser = async (
  req: Request,
  prisma: PrismaClient,
  requireAuth: Boolean = true
) => {
  try {
    if (!requireAuth) return null;
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new Error("You are not logged in. Please log in to get access!");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    const user = await prisma.user.findOne({
      where: {
        id: parseInt(decoded.id, 10),
      },
      include: {
        postLikes: true,
        posts: true,
        comments: true,
        commentLikes: true,
      },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    return user;
  } catch (err) {
    throw new Error(err);
  }
};
