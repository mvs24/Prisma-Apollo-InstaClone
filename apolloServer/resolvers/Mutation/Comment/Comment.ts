import { getUser } from "../../../../utils/getUser";
import { Context } from "../User/types";
import { CommentType } from "./types";

export const Comment = {
  async createComment(
    _parent: undefined,
    { content, postId }: CommentType,
    { req, prisma }: Context
  ) {
    try {
      const user = await getUser(req, prisma);

      if (!content) {
        throw new Error("A comment can not be empty!");
      }

      const post = await prisma.post.findOne({
        where: {
          id: parseInt(postId, 10),
        },
      });

      if (!post) {
        throw new Error("There is no post with this id!");
      }

      return prisma.comment.create({
        data: {
          content,
          post: {
            connect: {
              id: parseInt(postId, 10),
            },
          },
          user: {
            connect: {
              id: user!.id,
            },
          },
        },
        include: {
          replies: true,
          user: true,
          post: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
