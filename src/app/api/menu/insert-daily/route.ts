import { prisma } from "@/common/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { logAPI, logger } from "@/common/utils/logger";
import {
  getHourTimeDelta,
  getMinuteTimeDelta,
} from "@/common/var/cafeteriaTime";

export const revalidate = 3600;

//23:59までに
export const GET = async (req: NextRequest) => {
  logAPI(req);
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    logger.debug({ at: "auto-refund" }, "auto-refund unauthorized");
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }
  logger.debug({ at: "auto-refund" }, "auto-refund authorized");
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setUTCHours(
    tomorrow.getUTCHours() + (await getHourTimeDelta("kaisei")),
    tomorrow.getUTCMinutes() + (await getMinuteTimeDelta("kaisei"))
  );
  if (now.getUTCDate() === tomorrow.getUTCDate()) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  const presetInfo = await prisma.presetInfo.findUnique({
    where: {
      year_month_date: {
        year: tomorrow.getUTCFullYear(),
        month: tomorrow.getUTCMonth() + 1,
        date: tomorrow.getUTCDate(),
      },
    },
    select: {
      id: true,
      presetMenus: {
        select: {
          id: true,
          menuId: true,
          contents: true,
        },
      },
    },
  });

  if (!presetInfo || presetInfo?.presetMenus?.length === 0) {
    logger.debug({ at: "auto-insert-daily" }, "no preset daily menus");
    return NextResponse.json({ message: "no preset daily menus" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      for (const pMenu of presetInfo.presetMenus) {
        const result = await tx.menu.update({
          where: { id: pMenu.menuId },
          data: { contents: pMenu.contents },
        });
      }
    });

    logger.info({ at: "auto-insert-daily" }, "succeeded");
    return NextResponse.json({ message: "succeeded" });
  } catch (e) {
    logger.error({ at: "auto-insert-daily", error: e.stack }, "ERROR");
    return NextResponse.json({ message: "failed", error: e.message });
  }
};
