import { prisma } from "@/common/utils/prisma";
import { Ticket } from "@/common/types/ticket";
import { NextPage } from "next";
import React from "react";

import MyTicketsPageComponent from "@/components/app/my-tickets/myTicketsPage";
import { getServerSession } from "next-auth";
import { options } from "@/options";

import { getIsCafeteriaOpen } from "@/common/utils/cafeteriaTime";

export const dynamic = "force-dynamic";

// ユーザーが持っている食券を確認するページ
const MyTicketsPage: NextPage = async () => {
  const session = await getServerSession(options);
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      cafeteriaRelation: {
        select: {
          orgHandle: true,
        },
      },
    },
  });
  const myTickets = await prisma.ticket.findMany({
    where: {
      holderId: session.user.userId,
      status: "UNUSED",
    },
    select: {
      id: true,
      status: true,
      menuRelation: {
        select: {
          title: true,
          price: true,
          backgroundImageURL: true,
          contents: true,
          categoryHandle: true,
          isDaily: true,
          cafeteriaRelation: {
            select: {
              orgHandle: true,
            },
          },
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const { orderDurationMilliseconds } = await prisma.parameter.findUnique({
    where: {
      cafeteriaHandle: user.cafeteriaRelation.orgHandle,
    },
    select: {
      orderDurationMilliseconds: true,
    },
  });

  // const orderDurationMilliseconds = 1000 * 60 * 5;

  const isOperating = await getIsCafeteriaOpen("kaisei");

  return (
    <MyTicketsPageComponent
      myTickets={myTickets}
      isOperating={isOperating}
      orderDuration={orderDurationMilliseconds}
      // isOperating={true}
    />
  );
};

export default MyTicketsPage;
