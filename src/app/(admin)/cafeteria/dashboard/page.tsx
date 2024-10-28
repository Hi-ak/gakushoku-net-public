import { prisma } from "@/common/utils/prisma";
import { DashboardPageContent } from "./dashboard";
import { toZonedTime } from "date-fns-tz";
import { totalPriceFromTickets } from "@/common/utils/cart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const todaysMorning = new Date();
  todaysMorning.setUTCHours(todaysMorning.getUTCHours() + 9);
  todaysMorning.setUTCDate(todaysMorning.getUTCDate() - 0);
  todaysMorning.setUTCHours(0, 0, 0, 0);
  todaysMorning.setUTCHours(-9);
  const yesterdayMorning = new Date(todaysMorning);
  yesterdayMorning.setUTCDate(yesterdayMorning.getUTCDate() - 1);
  const tomorrowMorning = new Date(todaysMorning);
  tomorrowMorning.setUTCDate(tomorrowMorning.getUTCDate() + 1);

  const receipts = await prisma.receipt.findMany({
    where: {
      createdAt: {
        gte: todaysMorning,
        lt: tomorrowMorning,
      },
    },
    select: {
      totalPrice: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const todaysTotalPrice = receipts.reduce(
    (acc, receipt) => acc + receipt.totalPrice,
    0
  );
  const receiptsTaken5 = await prisma.receipt.findMany({
    where: {
      createdAt: {
        gte: todaysMorning,
        lt: tomorrowMorning,
      },
    },
    select: {
      paymentId: true,
      tickets: {
        select: {
          id: true,
          menuRelation: {
            select: {
              title: true,
            },
          },
        },
      },
      totalPrice: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
  const notUsedTickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["UNUSED", "REFUNDED", "ORDERED"],
      },
      createdAt: {
        gte: todaysMorning,
        lt: tomorrowMorning,
      },
    },
    select: {
      menuPrice: true,
      options: {
        select: {
          choicePrice: true,
        },
      },
    },
  });
  const notUsedTicketsTotalPrice = totalPriceFromTickets(notUsedTickets);
  const yesterdayReceipts = await prisma.receipt.findMany({
    where: {
      createdAt: {
        gte: yesterdayMorning,
        lt: todaysMorning,
      },
    },
    select: {
      totalPrice: true,
    },
  });
  const yesterdayRefundedTickets = await prisma.ticket.findMany({
    where: {
      status: "REFUNDED",
      createdAt: {
        gte: yesterdayMorning,
        lt: todaysMorning,
      },
    },
    select: {
      menuPrice: true,
      options: {
        select: {
          choicePrice: true,
        },
      },
    },
  });
  const yesterdayTotalPrice =
    yesterdayReceipts.reduce((acc, receipt) => acc + receipt.totalPrice, 0) -
    totalPriceFromTickets(yesterdayRefundedTickets);
  const ticketTaken5 = await prisma.ticket.findMany({
    where: {
      createdAt: {
        gte: todaysMorning,
        lt: tomorrowMorning,
      },
    },
    select: {
      id: true,
      menuPrice: true,
      menuRelation: {
        select: {
          title: true,
        },
      },
      options: {
        select: {
          choicePrice: true,
          choiceRelation: {
            select: {
              choiceName: true,
              isDefault: true,
            },
          },
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
  const orderTaken5 = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: todaysMorning,
        lt: tomorrowMorning,
      },
    },
    select: {
      id: true,
      tickets: {
        select: {
          menuPrice: true,
          menuRelation: {
            select: {
              title: true,
            },
          },
          options: {
            select: {
              choicePrice: true,
              choiceRelation: {
                select: {
                  choiceName: true,
                  isDefault: true,
                },
              },
            },
          },
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
  const orderNum = await prisma.order.count({
    where: {
      createdAt: {
        gte: todaysMorning,
        lt: tomorrowMorning,
      },
    },
  });
  const orderedTicketNum = await prisma.ticket.count({
    where: {
      createdAt: {
        gte: todaysMorning,
        lt: tomorrowMorning,
      },
      status: {
        in: ["ORDERED", "USED"],
      },
    },
  });
  return (
    <DashboardPageContent
      todayTotalPrice={todaysTotalPrice}
      todayToRefund={notUsedTicketsTotalPrice}
      yesterdaySum={yesterdayTotalPrice}
      receiptCount={receipts.length}
      receiptTaken5={receiptsTaken5}
      ticketTaken5={ticketTaken5}
      orderTaken5={orderTaken5}
      orderNum={orderNum}
      orderedTicketNum={orderedTicketNum}
    />
  );
}
