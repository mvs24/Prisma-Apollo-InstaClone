import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Signup, Login, ResetPassword } from "./types";
import { Context } from "./types";
import Email from "../../../../utils/Email";

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

const validateEmail = (email: string): void => {
  if (!email.match(/\S+@\S+\.\S+/)) {
    throw new Error("Please provide a valid email!");
  }
};

const validateEmailAndPassword = (email: string, password: string): void => {
  validateEmail(email);
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

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const User = {
  async signup(_parent: undefined, args: Signup["args"], { prisma }: Context) {
    const { password, email, name, lastname } = args.data;
    if (!name || !lastname) {
      throw new Error("Please provide a valid name and lastname!");
    }
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
  async login(_parent: undefined, args: Login, { prisma }: Context) {
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
  async forgotPassword(
    _parent: undefined,
    { email }: { email: string },
    { prisma }: Context
  ) {
    validateEmail(email);

    const user = await prisma.user.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("No user found with that email!");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = hashToken(resetToken);

    const resetExpires = Date.now() + 10 * 60 * 1000;

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(resetExpires),
      },
    });

    try {
      const newEmail = new Email({
        to: email,
        text: `Your password reset token is: \n ${resetToken}`,
        subject: "YOUR PASSWORD RESET TOKEN! (VALID FOR 10 minutes)",
      });
      await newEmail.sendMessage();

      console.log("send email", resetToken, new Date(resetExpires));
      return { message: "Reset token sent to email" };
    } catch (err) {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          passwordResetToken: undefined,
          passwordResetExpires: undefined,
        },
      });
      throw new Error(err);
    }
  },
  async resetPassword(
    _parent: undefined,
    { password, resetToken }: ResetPassword,
    { prisma }: Context
  ) {
    try {
      if (password.length < 6 || !resetToken) {
        throw new Error(
          "Please provide reset token & new password (greater than 6 characters)"
        );
      }

      const hashedToken = hashToken(resetToken);

      const [user] = await prisma.user.findMany({
        where: {
          passwordResetToken: hashedToken,
          passwordResetExpires: {
            gt: new Date(Date.now()),
          },
        },
      });

      if (!user) {
        throw new Error("Your token is invalid or has expired!");
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: await bcrypt.hash(password, 10),
          passwordResetExpires: null,
          passwordResetToken: null,
          passwordChangedAt: new Date(Date.now() - 1000),
        },
      });

      const token = signToken(user.id.toString());

      return {
        user,
        token,
      };
    } catch (err) {
      throw new Error(err);
    }
  },
};
