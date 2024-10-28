import { nextAuthOptionsFunction } from "@/options";
import { NextApiRequest } from "next";
import NextAuth from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export interface RouteHandlerContext {
  params: { nextauth: string[] };
}

const handler = (req: NextRequest, context: RouteHandlerContext) => {
  return NextAuth(req, context, nextAuthOptionsFunction(req, context));
};

export { handler as GET, handler as POST };
