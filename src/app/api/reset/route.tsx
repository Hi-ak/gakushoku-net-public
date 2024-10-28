import { ApiResponse } from "@/common/types/apiResponse";
import { authorize } from "@/common/utils/authorize";
import { logAPI } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  return NextResponse.json(
    {
      message: "Gone",
    },
    { status: 410 }
  );
  logAPI(req);
  const session = await getServerSession(options);
  if (!authorize("DEV", session)) {
    return notFound();
  }
  await prisma.$transaction(async (tx) => {
    await tx.ticketOptions.deleteMany();
    await tx.ticket.deleteMany();
    await tx.receipt.deleteMany();
    await tx.order.deleteMany();
    await tx.user.deleteMany();
  });
  return NextResponse.json({
    message: "success",
    success: true,
    code: 200,
  } as ApiResponse);
};
