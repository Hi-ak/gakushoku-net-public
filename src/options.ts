import type {
  CustomUser,
  DefaultSession,
  NextAuthOptions,
  SessionStrategy,
  User,
} from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";
import { RouteHandlerContext } from "./app/api/auth/[...nextauth]/route";
import { prisma } from "./common/utils/prisma";
import { NumberedRole } from "./common/enums/role";

declare module "next-auth" {
  interface CustomUser extends User {
    role?: string;
    userId: string;
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: CustomUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    user?: User;
  }
}

const compareRole = (role: string, target: string): string => {
  return NumberedRole[role] > (NumberedRole[target] || -1) ? role : target;
};

export const options: NextAuthOptions = {
  debug: false,
  session: { strategy: "jwt" as SessionStrategy },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.user = user;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role,
          userId: user.id,
        },
      };
    },
    signIn: async ({ user, account, credentials }) => {
      const orgHandle = "kaisei";
      const userEmailRel = await prisma.cafeteria_UserEmail.findMany({
        where: {
          cafeteriaHandle: orgHandle,
        },
      });
      let role = null;
      const dUser = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });
      for (const rel of userEmailRel) {
        if (rel.emailFilterType === "DOMAIN") {
          const emailDomain = user.email.split("@")[1];
          if (emailDomain === rel.emailFilter) {
            role = compareRole(rel.role, role);
          }
        } else if (rel.emailFilterType === "EQUAL") {
          if (user.email === rel.emailFilter) {
            role = compareRole(rel.role, role);
          }
        } else if (rel.emailFilterType === "REGEXP") {
          if (new RegExp(rel.emailFilter).test(user.email)) {
            role = compareRole(rel.role, role);
          }
        }
      }
      if (role === null) {
        if (dUser) {
          await prisma.user.delete({
            where: {
              email: user.email,
            },
          });
        }
        return false;
      }
      await prisma.user.upsert({
        create: {
          name: user.name,
          email: user.email,
          role,
          cafeteriaRelation: {
            connect: {
              orgHandle: orgHandle,
            },
          },
        },
        update: {},
        where: {
          email: user.email,
        },
      });
      return true;
    },
    redirect: async ({ url, baseUrl }) => {
      return "/guide";
    },
  },
  pages: {
    error: "/auth/error",
  },
};

export const nextAuthOptionsFunction = (
  req: NextRequest,
  context: RouteHandlerContext
): NextAuthOptions => {
  return options;
};
