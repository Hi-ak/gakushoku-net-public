import { prisma } from "@/common/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { refundTickets } from "@/common/utils/refund";
import { logAPI, logger } from "@/common/utils/logger";
import {
  getHourTimeDelta,
  getMinuteTimeDelta,
} from "@/common/var/cafeteriaTime";

export const revalidate = 3600;

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
  now.setUTCHours(
    now.getUTCHours() + (await getHourTimeDelta("kaisei")),
    now.getUTCMinutes() + (await getMinuteTimeDelta("kaisei"))
  );
  const ticketsToRefund = await prisma.ticket.findMany({
    where: {
      status: "UNUSED",
    },
    select: {
      id: true,
    },
  });
  const arHistory = await prisma.autoRefundHistory.create({
    data: {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    },
  });
  if (ticketsToRefund.length === 0) {
    await prisma.autoRefundHistory.update({
      where: {
        id: arHistory.id,
      },
      data: {
        status: "EMPTY",
        message: "nothing to refund",
      },
    });
    logger.debug({ at: "auto-refund" }, "nothing to refund");
    return NextResponse.json({ message: "nothing to refund" });
  }
  let res: {
    succeeded: string[];
    failed: string[];
  };
  try {
    res = await refundTickets(ticketsToRefund.map((t) => t.id));
  } catch (e) {
    await prisma.autoRefundHistory.update({
      where: { id: arHistory.id },
      data: {
        message: e.stack,
        status: "ERROR",
      },
    });
    logger.error({ at: "auto-refund", error: e.stack }, "ERROR");
    return NextResponse.json({ message: "failed" });
  }
  if (res.failed.length === 0) {
    await prisma.autoRefundHistory.update({
      where: {
        id: arHistory.id,
      },
      data: {
        status: "SUCCEEDED",
        succeededTicketIds: res.succeeded,
        failedTicketIds: res.failed,
      },
    });
    logger.info({ at: "auto-refund" }, "succeeded");
    return NextResponse.json({ message: "succeeded" });
  } else {
    await prisma.autoRefundHistory.update({
      where: {
        id: arHistory.id,
      },
      data: {
        status: "FAILED",
        succeededTicketIds: res.succeeded,
        failedTicketIds: res.failed,
      },
    });
    return NextResponse.json({ message: "some failed" });
  }
};
