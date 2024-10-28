import { prisma } from "@/common/utils/prisma";
import { NextPage } from "next";
import React from "react";
import CafeteriaMenuIndexControlPageComponent from "@/components/app/cafeteria/menu/index-control/cafeteriaMenuIndexControlPage";
import { authorize } from "@/common/utils/authorize";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { options as nextAuthOptions } from "@/options";

export const dynamic = "force-dynamic";
// メニューページ
// データ取得専用のサーバーコンポーネント
const CafeteriaMenuIndexControl: NextPage = async () => {
  const session = await getServerSession(nextAuthOptions);
  if (!authorize("ADMIN", session)) {
    return notFound();
  }
  // カテゴリーごとのメニューを取得
  const categoriesAndMenus = await prisma.menuCategory.findMany({
    select: {
      id: true,
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
          isDaily: true,
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

  const options = await prisma.menuOption.findMany({
    select: {
      id: true,
      optionHandle: true,
      optionName: true,
      choiceNum: true,
      priority: true,
      cafeteriaId: true,
    },
    orderBy: {
      priority: "desc",
    },
  });

  return (
    <CafeteriaMenuIndexControlPageComponent categories={categoriesAndMenus} />
  );
};

export default CafeteriaMenuIndexControl;
