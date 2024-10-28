import { MenuCard } from "@/components/cards/menuCard";
import { prisma } from "@/common/utils/prisma";
import { NextPage } from "next";
import React from "react";
import { CartTicket } from "@/common/types/cart";
import MenuPageComponent from "@/components/app/menu/menuPage";
import { getServerSession } from "next-auth";
import { options } from "@/options";
import {
  getTicketBuyingStartTime,
  getIsTicketBuyable,
} from "@/common/utils/cafeteriaTime";

export const dynamic = "force-dynamic";

const MAXIMUM_TICKET_NUM = 3; //1日に購入可能なチケット数

// メニューページ
// データ取得専用のサーバーコンポーネント
const MenuPage: NextPage = async () => {
  // カテゴリーごとのメニューを取得
  const session = await getServerSession(options);
  const categoriesAndMenus = await prisma.menuCategory.findMany({
    select: {
      categoryHandle: true,
      categoryName: true,
      index: true,
      menus: {
        where: {
          serviceStatus: {
            not: "UNAVAILABLE",
          },
        },
        select: {
          id: true,
          title: true,
          price: true,
          contents: true,
          backgroundImageURL: true,
          categoryHandle: true,
          serviceStatus: true,
          isDaily: true,
          options: {
            select: {
              optionHandle: true,
              optionName: true,
              choiceNum: true,
              choiceList: {
                select: {
                  choiceHandle: true,
                  choiceName: true,
                  priceDiff: true,
                  isDefault: true,
                },
                orderBy: {
                  index: "asc",
                },
              },
            },
            orderBy: {
              priority: "desc",
            },
          },
        },
        orderBy: {
          index: "asc",
        },
      },
    },
    orderBy: {
      index: "asc",
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.userId,
    },
    select: {
      id: true,
      cafeteriaId: true,
      cafeteriaRelation: {
        select: {
          orgHandle: true,
        },
      },
    },
  });

  const operationStart = await getTicketBuyingStartTime(
    user.cafeteriaRelation.orgHandle
  );

  const isOperating = await getIsTicketBuyable(
    user.cafeteriaRelation.orgHandle
  );

  const ticketsBaughtToday = await prisma.ticket.findMany({
    where: {
      holderId: user.id,
      createdAt: {
        gte: operationStart,
      },
    },
    select: {
      id: true,
      createdAt: true,
    },
  });
  return (
    <MenuPageComponent
      user={user}
      menus={categoriesAndMenus}
      isPurchaseRestricted={
        process.env.NODE_ENV === "production"
          ? ticketsBaughtToday.length > MAXIMUM_TICKET_NUM
          : false
      }
      isOperating={isOperating}
      // isPurchaseRestricted={false}
      // isOperating={true}
    />
  );
};

export default MenuPage;
