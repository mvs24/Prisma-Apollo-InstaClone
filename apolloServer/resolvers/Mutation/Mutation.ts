import { Comment } from "./Comment/Comment";
import { Following } from "./Following/Following";
import { Post } from "./Post/Post";
import { PostLike } from "./PostLike/PostLike";
import { Reply } from "./Reply/Reply";
import { User } from "./User/User";

export const Mutation = {
  ...User,
  ...Post,
  ...Comment,
  ...PostLike,
  ...Reply,
  ...Following,
};
