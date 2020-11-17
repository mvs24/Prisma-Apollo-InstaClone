import { getUser } from "../../../../utils/getUser";
import { Context } from "../User/types";
import { PostLikeTypes } from "./types";

export const PostLike = {
  async likePost(
    _parent: undefined,
    { postId }: PostLikeTypes,
    { req, prisma }: Context
  ) {
    //   if post is liked by the current logged in user-> unlike else -> like it
    const user = await getUser(req, prisma);
    const post = await prisma.post.findOne({
      where: {
        id: +postId,
      },
      include: {
        likes: true,
      },
    });

    if (!post) {
      throw new Error("No post found with that id!");
    }

    const likedPost = post.likes.find((like) => like.userId === user!.id);
    if (!!likedPost) {
      return prisma.postLike.delete({
        where: {
          id: likedPost.id,
        },
      });
    } else {
      return prisma.postLike.create({
        data: {
          user: {
            connect: {
              id: user!.id,
            },
          },
          post: {
            connect: {
              id: +postId,
            },
          },
        },
      });
    }
  },
};
