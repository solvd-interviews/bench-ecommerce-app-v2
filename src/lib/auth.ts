import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
export const config = {
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials;
        await dbConnect();
        console.log("credentials: ", credentials);
        if (
          typeof email !== "string" ||
          email.length < 3 ||
          typeof password !== "string" ||
          email.length < 3
        ) {
          throw new Error("The email or password are incorrect. Err 1.");
        }

        console.log("Validation passed");

        const user = await UserModel.findOne({ email });
        console.log("user found: ", user);
        if (user) {
          const isMatch = await compare(password, user.password);
          if (isMatch) {
            console.log("MATCH TRUE");
            return user;
          } else {
            throw new Error("The email or password are incorrect. Err 2.");
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ user, trigger, session, token }: any) {
      console.log("jwt function");
      if (user) {
        console.log("user in jwt");
        token.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          isBlocked: user.isBlocked,
          isAdmin: user.isAdmin,
        };
      }
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        };
      }
      console.log("token previous: ", token);
      return token;
    },
    async session({ session, token }: any) {
      console.log("session, token: ", session, token);
      if (token) {
        session.user = {
          ...session.user,
          isAdmin: token.user.isAdmin,
          isBlocked: token.user.isBlocked,
        };
      }
      console.log("session fin: ", session);
      return session;
    },
  },
};
