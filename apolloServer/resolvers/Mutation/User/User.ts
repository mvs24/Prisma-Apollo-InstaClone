import { Signup, Login } from "./types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "./types";

const signToken: (id: string) => string = (userId) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  const token = jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET
  );

  return token;
};

const validateEmailAndPassword = (email: string, password: string): void => {
  if (!email.match(/\S+@\S+\.\S+/)) {
    throw new Error("Please provide a valid email!");
  }
  if (password.length < 6) {
    throw new Error("Password field must be greater than 6 characters");
  }
};

const correctPassword: (
  candidatePassword: string,
  userPassword: string
) => Promise<Boolean> = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User = {
  async signup(
    _parent: undefined,
    args: Signup["args"],
    { req, prisma }: Context
  ) {
    const { password, email } = args.data;
    validateEmailAndPassword(email, password);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        ...args.data,
        password: hashedPassword,
      },
    });

    const token = signToken(user.id.toString());

    return {
      user,
      token,
    };
  },
  async login(_parent: undefined, args: Login, { req, prisma }: Context) {
    const { email, password } = args;
    validateEmailAndPassword(email, password);
    const user = await prisma.user.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await correctPassword(password, user.password))) {
      throw new Error("No user found! Invalid credentials.");
    }

    const token = signToken(user.id.toString());

    return {
      user,
      token,
    };
  },
};
