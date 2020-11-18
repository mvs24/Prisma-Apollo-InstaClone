import { getUser } from "../../../../utils/getUser";
import { Context } from "../User/types";
import { FollowingType } from "./types";

export const Following = {
  async addFollowing(
    _parent: undefined,
    { userId }: FollowingType,
    { req, prisma }: Context
  ) {
    const user = await getUser(req, prisma);

    return prisma.user.update({
      where: {
        id: user!.id,
      },
      data: {
        following: [...user!.following, userId],
      },
    });
  },
};
