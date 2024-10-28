import { ApiResponse } from "@/common/types/apiResponse";
import { authorize } from "@/common/utils/authorize";
import {
  getIsCafeteriaOpen,
  getIsTicketBuyable,
} from "@/common/utils/cafeteriaTime";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface OrderPostRequestBody {
  ticketIds: string[];
}

export interface OrderPostResponseBody extends ApiResponse {
  additionalData: string[];
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("USER", session))) {
    logger.debug({ at: "menu/purchase/cart" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const isOperating = await getIsCafeteriaOpen("kaisei");
  if (!isOperating) {
    logger.warn({ at: "ticket/order" }, "unable to order");
    return NextResponse.json(
      {
        success: false,
        code: 400,
        message: "現在は食券の使用ができません",
      } as OrderPostResponseBody,
      { status: 400 }
    );
  }
  const { ticketIds }: OrderPostRequestBody = await req.json();
  logger.debug({ at: "ticket/order", ticketIds });
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
    },
  });
  if (ticket.some((t) => t.status === "REFUNDED" || t.status === "USED")) {
    logger.warn({ at: "ticket/order" }, "ticket already used");
    return NextResponse.json(
      {
        success: false,
        code: 400,
        message: "使用済みのチケットが含まれています",
      } as OrderPostResponseBody,
      { status: 400 }
    );
  } else if (
    ticket.some((t) => t.holderRelation.email !== session.user.email)
  ) {
    logger.warn({ at: "ticket/order" }, "ticket not owned by user");
    return NextResponse.json(
      {
        success: false,
        code: 403,
        message: "他のユーザーのチケットを使用することはできません",
      } as OrderPostResponseBody,
      { status: 403 }
    );
  }
  try {
    await prisma.$transaction(async (tx) => {
      await tx.ticket.updateMany({
        where: {
          id: {
            in: ticketIds,
          },
        },
        data: {
          status: "ORDERED",
        },
      });
      const newestOrder = await tx.order.findFirst({
        orderBy: {
          orderNum: "desc",
        },
      });
      await tx.order.create({
        data: {
          tickets: {
            connect: ticketIds.map((id) => ({ id })),
          },
          issuerRelation: {
            connect: { id: session.user.userId },
          },
          orderNum: newestOrder ? newestOrder.orderNum + 1 : 1,
          cafeteriaRelation: {
            connect: {
              orgHandle: "kaisei",
            },
          },
        },
      });
    });
  } catch (e) {
    logger.error({ at: "ticket/order", error: e.stack }, "ERROR");
    return NextResponse.json({
      success: false,
      code: 500,
      message: "チケットが使用できませんでした",
    } as ApiResponse);
  }
  return NextResponse.json({
    success: true,
    code: 200,
    message: "正常にチケットを使用しました",
    additionalData: ticketIds,
  } as OrderPostResponseBody);
};
