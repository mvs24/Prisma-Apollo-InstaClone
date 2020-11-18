import { getUser } from "../../../../utils/getUser";
import { restrictTo } from "../../../../utils/restrictTo";
import { Context } from "../../Mutation/User/types";

export const User = {
  me(_parent: undefined, _args: undefined, { req, prisma }: Context) {
    return getUser(req, prisma);
  },
  async getUsers(
    _parent: undefined,
    { query }: { query: string },
    { req, prisma }: Context
  ) {
    const user = await getUser(req, prisma);
    restrictTo(user!.role, "ADMIN");

    return prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
        ],
      },
      select: {
        postLikes: {
          include: {
            post: true,
          },
        },
        commentLikes: true,
        comments: true,
        posts: true,
        lastname: true,
        role: true,
        password: false,
        passwordChangedAt: false,
        passwordResetExpires: false,
        email: false,
        passwordResetToken: false,
        name: true,
        photo: true,
        replies: {
          include: {
            comment: true,
          },
        },
        id: true,
      },
    });
  },
  async getFollowings(_parent: undefined, {}: {}, { req, prisma }: Context) {
    const user = await getUser(req, prisma);

    return await prisma.user.findMany({
      where: {
        id: {
          in: [...user!.following.map((el) => +el)],
        },
      },
      select: {
        password: false,
        posts: true,
        comments: true,
        postLikes: true,
        replies: true,
      },
    });
  },
  async getFollowers(_parent: undefined, {}: {}, { req, prisma }: Context) {
    const loggedInUser = await getUser(req, prisma);

    const allUsers = await prisma.user.findMany({
      where: {},
      include: {
        posts: true,
        comments: true,
        postLikes: true,
        replies: true,
      },
    });

    const followers: any[] = [];
    allUsers.forEach((user) => {
      if (user!.following.includes(loggedInUser!.id.toString())) {
        followers.push(user);
      }
    });

    return followers;
  },
};
