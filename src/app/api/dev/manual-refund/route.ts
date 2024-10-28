import { ApiResponse } from "@/common/types/apiResponse";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { refundPayment } from "@/common/utils/refund";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface ManualRefundPostRequestBody {
  paymentId: string;
  amount?: number;
}

export interface ManualRefundPostResponseBody extends ApiResponse {
  additionalData: {
    paymentId: string;
    amount: number;
  };
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("DEV", session))) {
    logger.debug({ at: "dev/manual-refund" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const { paymentId, amount } =
    (await req.json()) as ManualRefundPostRequestBody;
  const res = await refundPayment(paymentId, amount);
  if (!res.succeeded) {
    logger.error({ at: "dev/manual-refund" }, res.reason);
  } else {
    logger.debug({ at: "dev/manual-refund" }, "Refund succeeded");
  }
  return NextResponse.json({
    success: res.succeeded,
    message: res.succeeded ? "返金が完了しました。" : res.reason,
    additionalData: {
      paymentId,
      amount,
    },
  } as ManualRefundPostResponseBody);
};
