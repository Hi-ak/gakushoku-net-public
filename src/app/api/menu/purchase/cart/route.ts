import { ApiResponse } from "@/common/types/apiResponse";
import { ClientCartTicket } from "@/common/types/cart";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface PurchaseCartRequestDataBody {
  merchantPaymentId: string;
  cart: ClientCartTicket[];
  cafeteriaId: string;
  userId: string;
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("USER", session))) {
    logger.debug({ at: "menu/purchase/cart" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }

  const {
    cart,
    merchantPaymentId,
    cafeteriaId,
    userId,
  }: PurchaseCartRequestDataBody = await req.json();

  try {
    await prisma.$transaction(async (tx) => {
      for (const cartTicket of cart) {
        const res = await tx.cartTicket.create({
          data: {
            userId,
            merchantPaymentId,
            menuId: cartTicket.menuId,
            quantity: cartTicket.quantity,
          },
        });
        for (const option of cartTicket.options) {
          await tx.cartTicketOption.create({
            data: {
              cartTicketRelation: {
                connect: {
                  id: res.id,
                },
              },
              optionRelation: {
                connect: {
                  optionHandle_cafeteriaId: {
                    cafeteriaId,
                    optionHandle: option.optionHandle,
                  },
                },
              },
              choiceRelation: {
                connect: {
                  choiceHandle_menuOptionHandle_cafeteriaId: {
                    cafeteriaId,
                    menuOptionHandle: option.optionHandle,
                    choiceHandle: option.choiceHandle,
                  },
                },
              },
            },
          });
        }
      }
    });
  } catch (e) {
    logger.error({ at: "menu/purchase/cart", error: e.stack }, "ERROR");
    return NextResponse.json({
      success: false,
      message: e.message,
    } as ApiResponse);
  }

  logger.debug(
    { at: "menu/purchase/cart" },
    `Added ${cart.length} items to cart`
  );
  return NextResponse.json({
    success: true,
    message: `Added ${cart.length} items to cart`,
  } as ApiResponse);
};
