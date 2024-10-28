import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface RevertPostRequestBody {
  ticketIds: string[];
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "ticket/revert" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }

  const { ticketIds }: RevertPostRequestBody = await req.json();
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
  if (ticket.some((t) => t.status !== "ORDERED")) {
    logger.warn({ at: "ticket/revert" }, "ticket not ordered");
    return NextResponse.json({
      success: false,
      code: 400,
      message: "注文中でないチケットが含まれています",
    });
  } else if (
    ticket.some((t) => t.holderRelation.email !== session.user.email)
  ) {
    logger.warn({ at: "ticket/revert" }, "ticket not owned by user");
    return NextResponse.json({
      success: false,
      code: 400,
      message: "他のユーザーのチケットを回復することはできません",
    });
  }
  await prisma.$transaction(async (tx) => {
    await tx.ticket.updateMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
      data: {
        status: "UNUSED",
        orderId: null,
      },
    });
    const orderIds = Array.from(new Set(ticket.map((t) => t.orderId)));
    await tx.order.updateMany({
      where: {
        id: {
          in: orderIds,
        },
      },
      data: {
        orderStatus: "REVERTED",
      },
    });
  });
  logger.info({ at: "ticket/revert", ticketIds }, "ticket reverted");
  return NextResponse.json({ success: true });
};
