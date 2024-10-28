import { ApiResponse } from "@/common/types/apiResponse";
import { ServiceStatus } from "@/common/types/menu";
import { prisma } from "@/common/utils/prisma";
import { Menu } from "@/common/types/menu";
import { SortedMenuProp } from "@/common/types/menu";
import { NextRequest, NextResponse } from "next/server";
import { logAPI, logger } from "@/common/utils/logger";
import { getServerSession } from "next-auth";
import { options } from "@/options";
import { authorize } from "@/common/utils/authorize";

export interface MenuIndexPutBody {
  indexInfo: {
    [key: string]: SortedMenuProp[];
  };
}

export const PUT = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/menu/update-index" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const putBody: MenuIndexPutBody = await req.json();
  await prisma.$transaction(async (tx) => {
    for (const menuProps of Object.values(putBody.indexInfo)) {
      for (let i = 0; i < menuProps.length; i++) {
        await tx.menu.update({
          where: { id: menuProps[i].id },
          data: { index: i + 1 },
        });
      }
    }
  });

  const res = NextResponse.json({
    success: true,
    message: "正常にメニューの順番が更新されました。: ",
    code: 200,
  } as ApiResponse);
  return res;
};
