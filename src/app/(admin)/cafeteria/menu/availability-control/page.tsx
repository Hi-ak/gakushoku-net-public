import { prisma } from "@/common/utils/prisma";
import { NextPage } from "next";
import React from "react";
import CafeteriaAvailabilityControlPageComponent from "@/components/app/cafeteria/menu/availability-control/cafeteriaAvailabilityControlPage";
import { authorize } from "@/common/utils/authorize";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { options as nextAuthOptions } from "@/options";

export const dynamic = "force-dynamic";
// メニューページ
// データ取得専用のサーバーコンポーネント
const CafeteriaAvailabilityControl: NextPage = async () => {
  const session = await getServerSession(nextAuthOptions);
  if (!authorize("ADMIN", session)) {
    return notFound();
  }
  // カテゴリーごとのメニューを取得
  const categoriesAndMenus = await prisma.menuCategory.findMany({
    select: {
      categoryHandle: true,
      categoryName: true,
      index: true,
      menus: {
        select: {
          id: true,
          title: true,
          price: true,
          contents: true,
          backgroundImageURL: true,
          categoryHandle: true,
          availableQuantity: true,
          defaultQuantity: true,
          cafeteriaId: true,
          serviceStatus: true,
          isDaily: true,
          options: {
            select: {
              optionHandle: true,
              optionName: true,
              choiceNum: true,
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

  const menus = categoriesAndMenus.map((cat) => cat.menus).flat();

  const todaysMorning = new Date();
  todaysMorning.setUTCHours(todaysMorning.getUTCHours() + 9);
  todaysMorning.setUTCHours(0, 0, 0, 0);
  todaysMorning.setUTCHours(todaysMorning.getUTCHours() - 9);

  const menuSales: { [id: string]: number } = {};

  for (const menuId of menus.map((menu) => menu.id)) {
    const sales = (
      await prisma.ticket.findMany({
        where: {
          menuId,
          createdAt: {
            gte: todaysMorning,
          },
        },
      })
    ).length;
    menuSales[menuId] = sales;
  }

  return (
    <CafeteriaAvailabilityControlPageComponent
      menus={menus}
      menuSales={menuSales}
    />
  );
};

export default CafeteriaAvailabilityControl;
