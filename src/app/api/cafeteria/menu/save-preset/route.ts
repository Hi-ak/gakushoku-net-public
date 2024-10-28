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

export interface SavePresetPostBody {
  menuId: string;
  year: number;
  month: number;
  date: number;
  contents: string[];
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/menu/save-preset" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }

  const { menuId, year, month, date, contents }: SavePresetPostBody =
    await req.json();

  try {
    //create or find presetInfo
    const presetInfo = await prisma.presetInfo.upsert({
      where: {
        year_month_date: {
          year: year,
          month: month,
          date: date,
        },
      },
      create: {
        year: year,
        month: month,
        date: date,
      },
      update: {},
    });

    //create or update presetMenu
    const result = await prisma.presetMenu.upsert({
      where: {
        presetInfoId_menuId: {
          menuId: menuId,
          presetInfoId: presetInfo.id,
        },
      },
      create: {
        presetInfoId: presetInfo.id,
        menuId: menuId,
        contents: contents,
      },
      update: {
        contents: contents,
      },
    });

    const res = NextResponse.json({
      success: true,
      message: "正常にメニューを事前設定しました",
      code: 200,
      additionalData: {
        presetMenu: result,
      },
    } as ApiResponse);

    return res;
  } catch (e) {
    const res = NextResponse.json({
      success: false,
      message: "メニューを事前設定できませんでした。" + e,
      code: 500,
    });

    return res;
  }
};
