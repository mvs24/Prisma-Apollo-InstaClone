import { getUser } from "../../../utils/getUser";
import { Context } from "../Mutation/User/types";

export const User = {
  async me(_parent: undefined, args: undefined, { req, prisma }: Context) {
    return getUser(req, prisma);
  },
};
