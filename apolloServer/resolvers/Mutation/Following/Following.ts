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

    const allUsers = await prisma.user.findMany({
      where: {},
    });

    const followingRequests = allUsers.filter((el) => {
      return el.followingRequests.includes(user!.id.toString());
    });

    if (!followingRequests.some((el) => el.id.toString() === userId)) {
      throw new Error("This user has not requested to follow!");
    }

    return prisma.user.update({
      where: {
        id: user!.id,
      },
      data: {
        following: [...user!.following, userId],
      },
    });
  },
  async requestFollowing(
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
        followingRequests: [...user!.followingRequests, userId],
      },
    });
  },
};
