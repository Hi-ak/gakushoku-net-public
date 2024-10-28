import { ApiResponse } from "@/common/types/apiResponse";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface UsedPostRequestBody {
  ticketIds: string[];
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("USER", session))) {
    logger.debug({ at: "ticket/used" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const { ticketIds }: UsedPostRequestBody = await req.json();
  const ticket = await prisma.ticket.findMany({
    where: {
      id: {
        in: ticketIds,
      },
    },
    select: {
      status: true,
      holderRelation: {
        select: {
          email: true,
        },
      },
      orderId: true,
    },
  });
  if (ticket.some((t) => t.status === "REFUNDED" || t.status === "USED")) {
    logger.warn({ at: "ticket/used" }, "ticket already used");
    return NextResponse.json({
      success: false,
      code: 400,
      message: "使用済み、あるいは返金済みのチケットが含まれています",
    });
  } else if (
    ticket.some((t) => t.holderRelation.email !== session.user.email)
  ) {
    logger.warn({ at: "ticket/used" }, "ticket not owned by user");
    return NextResponse.json({
      success: false,
      code: 400,
      message: "他のユーザーのチケットを使用することはできません",
    });
  } else if (ticket.every((t) => t.orderId !== ticket[0].orderId)) {
    logger.error({ at: "ticket/used" }, "ticket order mismatch");
    return NextResponse.json(
      {
        success: false,
        code: 400,
        message: "チケットのオーダーが一致しません",
      } as ApiResponse,
      { status: 400 }
    );
  }
  await prisma.$transaction(async (tx) => {
    await tx.ticket.updateMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
      data: {
        status: "USED",
      },
    });
    await tx.order.updateMany({
      where: {
        id: ticket[0].orderId,
      },
      data: {
        orderStatus: "RECEIVED",
      },
    });
  });
  return NextResponse.json({
    success: true,
    code: 200,
    message: "チケットを使用しました",
  } as ApiResponse);
};
