import { NextResponse } from "next/server";
import PAYPAY from "@paypayopa/paypayopa-sdk-node";
import { ApiResponse } from "@/common/types/apiResponse";
import { uuid } from "short-uuid";
import { logAPI, logger } from "@/common/utils/logger";
import { getIsTicketBuyable } from "@/common/utils/cafeteriaTime";
import { authorize } from "@/common/utils/authorize";
import { getServerSession } from "next-auth";
import { options } from "@/options";

PAYPAY.Configure({
  clientId: process.env.PAYPAY_API_KEY || "",
  clientSecret: process.env.PAYPAY_SECRET || "",
  merchantId: process.env.PAYPAY_MERCHANT_ID,
  productionMode: process.env.PAYPAY_PRODUCTION_MODE === "true",
});

export interface PaypayGetQRRequestBody {
  amount: string;
  userAgent: string;
  hostname: string;
}

export interface PaypayGetQRResponseBody extends ApiResponse {
  merchantPaymentId: string;
}

export const POST = async (req: Request) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("USER", session))) {
    logger.debug({ at: "menu/purchase/cart" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }

  const isOperating = await getIsTicketBuyable("kaisei");
  if (!isOperating) {
    logger.warn({ at: "paypay/get-qr" }, "unable to purchase");
    return NextResponse.json({
      success: false,
      message: "現在は食券の購入ができません",
    } as ApiResponse);
  }
  const { amount, userAgent, hostname } = await req.json();
  const merchantPaymentId = uuid();
  logger.debug(merchantPaymentId);
  const orderDescription = "食券購入のお支払";
  const payload = {
    merchantPaymentId: merchantPaymentId,
    amount: {
      amount: parseInt(amount),
      currency: "JPY",
    },
    codeType: "ORDER_QR",
    orderDescription: orderDescription,
    isAuthorization: false,
    redirectUrl: `${hostname}/paypay/redirect/${merchantPaymentId}`, // Redirect URL
    redirectType: "WEB_LINK",
    userAgent: userAgent,
  };

  try {
    const payRes = await PAYPAY.QRCodeCreate(payload);
    return NextResponse.json({
      success: true,
      merchantPaymentId: merchantPaymentId,
      additionalData: payRes,
    } as PaypayGetQRResponseBody);
  } catch (error) {
    console.error({ at: "paypay/get-qr", error: error.stack }, "ERROR");
    return NextResponse.json({
      success: false,
      message: "PayPay Payment Error",
    } as ApiResponse);
  }
};
