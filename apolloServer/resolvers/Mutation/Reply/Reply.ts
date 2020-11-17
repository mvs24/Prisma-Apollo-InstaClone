import { getUser } from "../../../../utils/getUser";
import { Context } from "../User/types";
import { ReplyTypes } from "./types";

export const Reply = {
  async createReply(
    _parent: undefined,
    { content, commentId }: ReplyTypes,
    { req, prisma }: Context
  ) {
    const user = await getUser(req, prisma);

    if (!content) {
      throw new Error("Reply can not be empty!");
    }

    const comment = prisma.comment.findOne({
      where: {
        id: +commentId,
      },
    });

    if (!comment) {
      throw new Error("No comment found with that id!");
    }

    return prisma.reply.create({
      data: {
        content,
        comment: {
          connect: {
            id: +commentId,
          },
        },
        user: {
          connect: {
            id: user!.id,
          },
        },
      },
      include: {
        user: true,
        comment: {
          include: {
            post: true,
            replies: {
              include: {
                comment: true,
              },
            },
          },
        },
      },
    });
  },
};
