import PAYPAY, { GetCodePaymentDetails } from "@paypayopa/paypayopa-sdk-node";
import { prisma } from "./prisma";
import { ClientCartTicket } from "../types/cart";
import { totalAmountFromCart, totalPriceFromCart } from "./cart";
import { getTaxSettings } from "./tax";
import { PaymentTypes } from "@prisma/client";
import { logger } from "./logger";

const processAt = "2024-09-03T13:08:05.000Z";

export type PurchaseStatusReason =
  | "timeout"
  | "error"
  | "processing"
  | "payment-cancelled"
  | "not-payed"
  | "deleted";

export const purchase = async (
  merchantPaymentId: string,
  paymentType: PaymentTypes,
  autoPurchase: boolean = false
): Promise<{
  success: boolean;
  reason?: PurchaseStatusReason;
  alreadyPurchased?: boolean;
}> => {
  while (new Date().getTime() < new Date(processAt).getTime()) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  logger.debug(
    { at: "purchase", autoPurchase },
    ["PURCHASE", merchantPaymentId].join(" ")
  );
  let detailsRes;
  const started = new Date().getTime();
  PAYPAY.Configure({
    clientId: process.env.PAYPAY_API_KEY || "",
    clientSecret: process.env.PAYPAY_SECRET || "",
    merchantId: process.env.PAYPAY_MERCHANT_ID,
    productionMode: process.env.PAYPAY_PRODUCTION_MODE === "true",
  });

  const cartTickets = await prisma.cartTicket.findMany({
    where: {
      merchantPaymentId,
    },
    select: {
      id: true,
      merchantPaymentId: true,
      quantity: true,
      menuId: true,
      userId: true,
      menuRelation: {
        select: {
          price: true,
          title: true,
          cafeteriaId: true,
          cafeteriaRelation: {
            select: {
              orgHandle: true,
            },
          },
        },
      },
      options: {
        select: {
          optionRelation: {
            select: {
              optionHandle: true,
            },
          },
          choiceRelation: {
            select: {
              choiceHandle: true,
              priceDiff: true,
            },
          },
        },
      },
      specialStatus: true,
      createdAt: true,
    },
  });
  const {
    timeToTimeoutAtPurchaseMilliseconds,
    timeToDeleteCartTicketMilliseconds,
  } = await prisma.parameter.findUnique({
    where: {
      cafeteriaHandle: cartTickets[0].menuRelation.cafeteriaRelation.orgHandle,
    },
    select: {
      timeToTimeoutAtPurchaseMilliseconds: true,
      timeToDeleteCartTicketMilliseconds: true,
    },
  });
  const timeout = timeToTimeoutAtPurchaseMilliseconds || 1000 * 15;
  const now = new Date();
  try {
    while (detailsRes?.BODY?.data?.status !== "COMPLETED") {
      detailsRes = await GetCodePaymentDetails([merchantPaymentId]);
      logger.debug({ at: "purchase.ts", detailsRes }, "Details Response");
      if (detailsRes?.BODY?.data?.status === "COMPLETED") {
        break;
      }

      if (detailsRes.BODY.data.status === "CREATED") {
        if (
          now.getTime() >=
          cartTickets[0].createdAt.getTime() +
            timeToDeleteCartTicketMilliseconds
        ) {
          await prisma.cartTicket.deleteMany({
            where: {
              merchantPaymentId,
            },
          });
          return { success: false, reason: "deleted" };
        }
        return { success: false, reason: "not-payed" };
      } else if (detailsRes.BODY.data.status === "FAILED") {
        await prisma.cartTicket.deleteMany({
          where: {
            merchantPaymentId,
          },
        });
        return { success: false, reason: "payment-cancelled" };
      } else {
        logger.warn(
          { at: "purchase.ts", res: detailsRes.BODY, merchantPaymentId },
          "Something went wrong with PayPay Response."
        );
      }

      if (new Date().getTime() - started > timeout) {
        return { success: false, reason: "timeout" };
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (e) {
    logger.error(
      { at: "purchase.ts", error: e.stack, merchantPaymentId },
      "Error in purchase.ts"
    );
    return { success: false, reason: "error" };
  }
  const userId = cartTickets[0].userId;
  const cafeteriaId = cartTickets[0].menuRelation.cafeteriaId;

  await prisma.$transaction(async (tx) => {
    const clientCartTickets: ClientCartTicket[] = cartTickets.map(
      (cartTicket) => ({
        tempId: cartTicket.id,
        merchantPaymentId: cartTicket.merchantPaymentId,
        menuPrice: cartTicket.menuRelation.price,
        menuTitle: cartTicket.menuRelation.title,
        menuId: cartTicket.menuId,
        quantity: cartTicket.quantity,
        options: cartTicket.options.map((option) => ({
          optionHandle: option.optionRelation.optionHandle,
          choiceHandle: option.choiceRelation.choiceHandle,
          isDefault: true,
          priceDiff: option.choiceRelation.priceDiff,
        })),
      })
    ) as ClientCartTicket[];

    // return NextResponse.json({});

    const totalAmount = totalAmountFromCart(clientCartTickets);

    const totalPrice = totalPriceFromCart(clientCartTickets);

    const currentTaxSettings = await getTaxSettings();
    const receipt = await tx.receipt.create({
      data: {
        issuerRelation: {
          connect: {
            id: cafeteriaId,
          },
        },
        recipientRelation: {
          connect: {
            id: userId,
          },
        },
        totalAmount,
        totalPrice,
        paymentType,
        processingType: autoPurchase ? "AUTO_PURCHASED" : "NORMAL",
        paymentId: (detailsRes as any).BODY.data.paymentId,
        taxRate: currentTaxSettings.taxRate,
      },
    });

    for (const cartTicket of clientCartTickets) {
      for (let i = 0; i < cartTicket.quantity; i++) {
        await tx.ticket.create({
          data: {
            menuRelation: {
              connect: {
                id: cartTicket.menuId,
              },
            },
            menuPrice: cartTicket.menuPrice,
            holderRelation: {
              connect: {
                id: userId,
              },
            },
            receiptRelation: {
              connect: {
                id: receipt.id,
              },
            },
            options: {
              create: cartTicket.options.map((option) => ({
                optionRelation: {
                  connect: {
                    optionHandle_cafeteriaId: {
                      optionHandle: option.optionHandle,
                      cafeteriaId: cafeteriaId,
                    },
                  },
                },
                choiceRelation: {
                  connect: {
                    choiceHandle_menuOptionHandle_cafeteriaId: {
                      choiceHandle: option.choiceHandle,
                      menuOptionHandle: option.optionHandle,
                      cafeteriaId: cafeteriaId,
                    },
                  },
                },
                choicePrice: option.priceDiff, //税金対応で追加
              })),
            },
          },
        });
      }
    }
    const res = await tx.cartTicket.deleteMany({
      where: {
        merchantPaymentId: merchantPaymentId,
      },
    });
    if (res.count === 0) {
      throw new Error("Failed to delete cart tickets");
    }
  });

  return { success: true, alreadyPurchased: false };
};
