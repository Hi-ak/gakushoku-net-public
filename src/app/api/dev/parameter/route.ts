import { ApiResponse } from "@/common/types/apiResponse";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { DaySetting, Parameter } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface ParameterPutRequestBody {
  cafeteriaHandle: string;
  parameter: Parameter;
  daySetting: DaySetting;
}

export const PUT = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("DEV", session))) {
    logger.debug({ at: "dev/parameter" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const { cafeteriaHandle, parameter, daySetting } =
    (await req.json()) as ParameterPutRequestBody;
  try {
    await prisma.parameter.update({
      where: { cafeteriaHandle },
      data: parameter,
    });
    await prisma.daySetting.update({
      where: { cafeteriaHandle },
      data: daySetting,
    });
    return NextResponse.json({ success: true } as ApiResponse);
  } catch (e) {
    return NextResponse.json({ success: false, message: e } as ApiResponse);
  }
};
