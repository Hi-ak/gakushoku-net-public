import { ApiResponse } from "@/common/types/apiResponse";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { purchase, PurchaseStatusReason } from "@/common/utils/purchase";
import { Payment } from "@/common/var/payment";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export type PurchaseRequestDataBody = {
  paymentType: Payment;
  merchantPaymentId: string;
};

export type PurchaseResponseJson = {
  success: boolean;
  message: string;
  code: number;
};

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("USER", session))) {
    logger.debug({ at: "menu/purchase/cart" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }

  const { paymentType, merchantPaymentId } =
    (await req.json()) as PurchaseRequestDataBody;
  let res: {
    success: boolean;
    reason?: PurchaseStatusReason;
    alreadyPurchased?: boolean;
  };
  try {
    res = await purchase(merchantPaymentId, paymentType);
  } catch (e) {
    logger.error({ at: "menu/purchase", error: e.stack }, "ERROR");
    return NextResponse.json({
      success: false,
      message: "エラーが発生しました。",
      code: 500,
    } as ApiResponse);
  }
  if (!res.success) {
    logger.error(
      { at: "menu/purchase", reason: res.reason },
      "purchase failed"
    );
    return NextResponse.json({
      success: res.success,
      message: res.reason,
      code: 500,
    } as ApiResponse);
  }
  return NextResponse.json({
    success: res.success,
    message: res.success ? "購入が完了しました。" : res.reason,
    code: 200,
  } as ApiResponse);
};
