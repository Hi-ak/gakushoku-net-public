import { ApiResponse } from "@/common/types/apiResponse";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface InitParameterPostRequestBody {
  cafeteriaHandle: string;
}

type InitStatus = "created" | "existed" | "failed";

export interface InitParameterPostResponseBody extends ApiResponse {
  additionalData: {
    status: {
      parameter: InitStatus;
      daySetting: InitStatus;
    };
  };
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("DEV", session))) {
    logger.debug({ at: "dev/parameter/init" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  let status: {
    parameter?: InitStatus;
    daySetting?: InitStatus;
  } = {};
  const { cafeteriaHandle } = await req.json();
  try {
    const parameter = await prisma.parameter.findFirst({
      where: { cafeteriaHandle },
    });
    if (parameter) {
      status.parameter = "existed";
    } else {
      status.parameter = "created";
      await prisma.parameter.create({
        data: {
          cafeteriaOpenAtHour: 0,
          cafeteriaOpenAtMinute: 0,
          cafeteriaCloseAtHour: 0,
          cafeteriaCloseAtMinute: 0,
          ticketBuyableStartAtHour: 0,
          ticketBuyableStartAtMinute: 0,
          ticketBuyableEndAtHour: 0,
          ticketBuyableEndAtMinute: 0,
          orderDurationMilliseconds: 0,
          timeToDeleteCartTicketMilliseconds: 0,
          timeToTimeoutAtPurchaseMilliseconds: 0,
          timezoneHourTimeDelta: 9,
          timezoneMinuteTimeDelta: 0,
          cafeteriaHandle,
        },
      });
    }
  } catch (e) {
    logger.error(e);
    status.parameter = "failed";
  }

  try {
    const daySetting = await prisma.daySetting.findFirst({
      where: { cafeteriaHandle },
    });
    if (daySetting) {
      status.daySetting = "existed";
    } else {
      status.daySetting = "created";
      await prisma.daySetting.create({
        data: {
          cafeteriaHandle,
          sun: false,
          mon: true,
          tue: true,
          wed: true,
          thu: true,
          fri: true,
          sat: true,
        },
      });
    }
  } catch (e) {
    logger.error(e);
    status.daySetting = "failed";
  }

  return NextResponse.json({
    status: 200,
    message: "OK",
    success: true,
    additionalData: { status },
  } as InitParameterPostResponseBody);
};
