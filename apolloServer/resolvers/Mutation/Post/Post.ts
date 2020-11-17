import { getUser } from "../../../../utils/getUser";
import { Context } from "../User/types";
import { PostType } from "./types";

export const Post = {
  async createPost(
    _parent: undefined,
    { content }: PostType,
    { req, prisma }: Context
  ) {
    const user = await getUser(req, prisma);

    return prisma.post.create({
      data: {
        user: {
          connect: {
            id: user!.id,
          },
        },
        content,
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    });
  },
  async deletePost(
    _parent: undefined,
    { postId }: { postId: string },
    { req, prisma }: Context
  ) {
    const user = await getUser(req, prisma);

    const post = await prisma.post.findMany({
      where: {
        user: {
          id: +user!.id,
        },
        id: +postId,
      },
    });

    if (!post) {
      throw new Error("You are not allowed to delete this post!");
    }

    //CASCDE & SET NULL need to be added to db manually
    return prisma.post.delete({
      where: {
        id: +postId,
      },
    });
  },
};
