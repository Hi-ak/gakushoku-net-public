import { prisma } from "@/common/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/common/types/apiResponse";
import { purchase } from "@/common/utils/purchase";
import { logAPI, logger } from "@/common/utils/logger";

export const GET = async (req: NextRequest) => {
  logger.trace({ at: "check-cart" }, "CHECK CART", new Date());
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    logger.debug({ at: "check-cart" }, "check-cart unauthorized");
    return new Response("UNAUTHORIZED", { status: 401 });
  }
  const cartTickets = await prisma.cartTicket.findMany({
    select: {
      id: true,
      merchantPaymentId: true,
      userId: true,
      menuId: true,
      menuRelation: {
        select: {
          cafeteriaId: true,
        },
      },
      quantity: true,
      createdAt: true,
    },
  });
  const toCheck = Array.from(
    new Set(cartTickets.map((ticket) => ticket.merchantPaymentId))
  );
  logger.trace({ at: "check-cart" }, toCheck.toString());
  for (const merchantPaymentId of toCheck) {
    let res;
    try {
      res = await purchase(merchantPaymentId, "PAYPAY", true);
    } catch (e) {
      logger.error({ at: "check-cart", error: e.stack }, "ERROR");
    }
    logger.debug({ at: "check-cart", result: res }, "RESULT");
  }
  return NextResponse.json({
    success: true,
    message: "購入が完了しました。",
    code: 200,
  } as ApiResponse);
};
