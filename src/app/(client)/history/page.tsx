import { prisma } from "@/common/utils/prisma";
import { Ticket } from "@/common/types/ticket";
import { Receipt } from "@/common/types/receipt";
import { NextPage } from "next";
import React from "react";

import { HistoryPageComponent } from "@/app/(client)/history/historyPage";
import { getServerSession } from "next-auth";
import { options } from "@/options";

export const dynamic = "force-dynamic";

// ユーザーの購入済情報（Receiptオブジェクト）をリスト表示するページ
const HistoryPage: NextPage = async () => {
  const session = await getServerSession(options);
  const myTickets = await prisma.ticket.findMany({
    where: {
      holderId: session.user.userId,
    },
    select: {
      id: true,
      menuRelation: {
        select: {
          title: true,
          price: true,
        },
      },
      options: {
        select: {
          choiceRelation: {
            select: {
              choiceName: true,
              priceDiff: true,
              isDefault: true,
              choiceHandle: true,
            },
          },
          ticketId: true,
        },
      },
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <HistoryPageComponent myTickets={myTickets}></HistoryPageComponent>;
};

export default HistoryPage;
