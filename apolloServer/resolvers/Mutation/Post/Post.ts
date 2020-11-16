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
};
