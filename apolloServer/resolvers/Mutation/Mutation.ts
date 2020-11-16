import { Post } from "./Post/Post";
import { User } from "./User/User";

export const Mutation = {
  ...User,
  ...Post,
};
