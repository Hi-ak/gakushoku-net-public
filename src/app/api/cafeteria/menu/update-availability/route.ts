import { ApiResponse } from "@/common/types/apiResponse";
import { ServiceStatus, serviceStatuses } from "@/common/types/menu";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { Menu } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface AvailabilityPutRequestBody {
  id: string;
  serviceStatus: ServiceStatus;
}

export interface AvailabilityPutResponseBody extends ApiResponse {
  additionalData: {
    currentStatus: ServiceStatus;
  };
}

export const PUT = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/menu/update-availability" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const putBody: AvailabilityPutRequestBody = await req.json();
  const prevMenu = await prisma.menu.findUnique({
    where: {
      id: putBody.id,
    },
    select: {
      serviceStatus: true,
    },
  });
  if (prevMenu.serviceStatus === "UNAVAILABLE") {
    return NextResponse.json({
      success: false,
      message: "Menu is UNAVAILABLE",
      code: 400,
      additionalData: {
        currentStatus: prevMenu.serviceStatus,
      },
    } as AvailabilityPutResponseBody);
  }
  const menu = await prisma.menu.update({
    where: { id: putBody.id },
    data: {
      serviceStatus: putBody.serviceStatus,
    },
  });

  const res = NextResponse.json({
    success: true,
    message:
      "Menu updated successfully: " + menu.title + " as " + menu.serviceStatus,
    code: 200,
    additionalData: {
      currentStatus: menu.serviceStatus,
    },
  } as AvailabilityPutResponseBody);
  return res;
};
