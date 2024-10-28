import { sign } from "crypto";
import { withAuth } from "next-auth/middleware";
import { prisma } from "./common/utils/prisma";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { options } from "./options";
import { logger } from "./common/utils/logger";
import { method } from "lodash";
import { authorize } from "./common/utils/authorize";
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
export default withAuth(
  async function middleware(req) {
    // callbacks.authorizedがtrueの場合のみ進入できる
    // logger.debug("in middleware: ", req.nextauth.token);
    // if (!req.nextUrl.pathname.startsWith("/maintenance")) {
    //   if (
    //     req.cookies.get("maintenance_pass")?.value ===
    //     process.env.MAINTENANCE_PASS
    //   ) {
    //     return;
    //   }
    //   return NextResponse.redirect(req.nextUrl.origin + "/maintenance.html");
    // }
    // return;
    if (req.nextUrl.pathname.startsWith("/maintenance")) {
      return NextResponse.redirect(req.nextUrl.origin);
    }
  },
  {
    callbacks: {
      authorized: async ({ token, req }) => {
        // 少人数実施テストの名残
        // const tempId = req.cookies.get("tempUserId")?.value;
        // if (tempId) {
        //   return true;
        // }
        // return false;

        return !!token;
      },
    },
    pages: {
      signIn: "login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|login|landing|public|_next/image|_next/static|favicon.ico|auth/error).*)",
  ], // ?!で否定です。
};
