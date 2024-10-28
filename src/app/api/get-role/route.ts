import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { nextAuthOptionsFunction, options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface GetRoleGetResponseBody {
  role: string;
}

export const GET = async (req: NextRequest) => {
  return NextResponse.json({ message: "Gone" }, { status: 410 });
  logAPI(req);
  const session = await getServerSession(options);
  if (!session) {
    logger.warn({ at: "get-role" }, "no session");
    return NextResponse.json({ role: "USER" });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.userId },
    select: { role: true },
  });
  return NextResponse.json({ role: user.role });
};
