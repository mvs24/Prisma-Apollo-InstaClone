import { Context } from "../User/types";
import { CommentLikeTypes } from "./types";

export const CommentLike = {
  async addCommentLike(
    _parent: undefined,
    { commentId }: CommentLikeTypes,
    { req, prisma }: Context
  ) {},
};
