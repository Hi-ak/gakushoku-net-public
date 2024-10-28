import PAYPAY from "@paypayopa/paypayopa-sdk-node";
import { prisma } from "./prisma";
import {
  CartTotalPrice,
  totalAmountFromCart,
  totalPriceFromCart,
} from "./cart";
import { uuid } from "short-uuid";
import {
  HttpsClientError,
  HttpsClientSuccess,
} from "@paypayopa/paypayopa-sdk-node/dist/lib/httpsClient";
import { logger } from "./logger";
import { error } from "console";
import { fail } from "assert";

export const refundPayment = async (
  paymentId: string,
  amount?: number
): Promise<{ succeeded: boolean; reason?: string }> => {
  PAYPAY.Configure({
    clientId: process.env.PAYPAY_API_KEY || "",
    clientSecret: process.env.PAYPAY_SECRET || "",
    merchantId: process.env.PAYPAY_MERCHANT_ID,
    productionMode: process.env.PAYPAY_PRODUCTION_MODE === "true",
  });

  const receipt = await prisma.receipt.findUnique({
    where: {
      paymentId,
    },
    select: {
      totalPrice: true,
      tickets: {
        select: {
          id: true,
        },
      },
    },
  });

  if (amount > receipt.totalPrice) {
    return { succeeded: false, reason: "Refund amount is larger than total" };
  }

  const payload = {
    merchantRefundId: uuid(),
    paymentId: paymentId,
    amount: {
      amount: amount || receipt.totalPrice,
      currency: "JPY",
    },
    reason: "食券の使用期限切れ",
  };

  const result = (await PAYPAY.PaymentRefund(payload)) as any;

  // このログ出力は本番でも残しておく
  logger.info({ at: "refund.ts", result });

  await prisma.ticket.updateMany({
    where: {
      id: {
        in: receipt.tickets.map((t) => t.id),
      },
    },
    data: {
      status: "REFUNDED",
    },
  });

  try {
    if (result.BODY.resultInfo.code === "SUCCESS") {
      return { succeeded: true };
    } else {
      logger.error(
        { result: result.BODY.resultInfo, error: "PayPay Error", paymentId },
        `ERROR`
      );
      logger.info({ result });
      return { succeeded: false, reason: "PayPay Error" };
    }
  } catch (e) {
    logger.error({ error: e.stack, paymentId }, `ERROR`);
    return { succeeded: false, reason: "Runtime Error" };
  }
};

export const refundTickets = async (refundTicketIds: string[]) => {
  const receipts = await prisma.receipt.findMany({
    where: {
      tickets: {
        some: {
          id: {
            in: refundTicketIds,
          },
        },
      },
    },
    select: {
      id: true,
      paymentId: true,
      tickets: {
        where: {
          id: {
            in: refundTicketIds,
          },
          status: "UNUSED",
        },
        select: {
          id: true,
          options: {
            select: {
              choiceRelation: {
                select: {
                  priceDiff: true,
                },
              },
            },
          },
          menuRelation: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

  PAYPAY.Configure({
    clientId: process.env.PAYPAY_API_KEY || "",
    clientSecret: process.env.PAYPAY_SECRET || "",
    merchantId: process.env.PAYPAY_MERCHANT_ID,
    productionMode: process.env.PAYPAY_PRODUCTION_MODE === "true",
  });

  const results: { [id: string]: HttpsClientError | HttpsClientSuccess } = {};

  const merchantRefundId = uuid();
  // TODO: もしかしたら timeout 用に get refund details も使う必要がある。
  for (let receipt of receipts) {
    const payload = {
      merchantRefundId: merchantRefundId,
      paymentId: receipt.paymentId,
      amount: {
        amount: totalPriceFromCart(
          receipt.tickets.map(
            (t) =>
              ({
                menuPrice: t.menuRelation.price,
                options: t.options.map((o) => ({
                  priceDiff: o.choiceRelation.priceDiff,
                })),
                quantity: 1,
              } as CartTotalPrice)
          )
        ),
        currency: "JPY",
      },
      reason: "食券の使用期限切れ",
    };
    results[receipt.id] = await PAYPAY.PaymentRefund(payload);
  }

  // このログ出力は本番でも残しておく
  logger.info({ at: "refund.ts", results });

  const succeeded: typeof receipts = [];

  const failed: typeof receipts = [];

  for (let receipt of receipts) {
    try {
      if ((results[receipt.id] as any).BODY.resultInfo.code === "SUCCESS") {
        succeeded.push(receipt);
      } else {
        logger.error(
          { at: "refund.ts", res: results[receipt.id] },
          `failed!\n${receipt.id}`
        );
        failed.push(receipt);
      }
    } catch (e) {
      logger.error({ at: "refund.ts", error: e.stack, receipt }, "ERROR");
      failed.push(receipt);
    }
  }

  await prisma.$transaction(async (tx) => {
    await prisma.ticket.updateMany({
      where: {
        id: {
          in: succeeded
            .map((rec) => rec.tickets.map((tick) => tick.id))
            .reduce((prev, curr) => [...prev, ...curr], []),
        },
      },
      data: {
        status: "REFUNDED",
      },
    });
  });

  return {
    succeeded: succeeded
      .map((r) => r.tickets.map((t) => t.id))
      .reduce((p, c) => [...p, ...c], []),
    failed: failed
      .map((r) => r.tickets.map((t) => t.id))
      .reduce((p, c) => [...p, ...c], []),
  };
};
