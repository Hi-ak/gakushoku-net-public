import { prisma } from "@/common/utils/prisma";
import { NextPage } from "next";
import React from "react";

import { authorize } from "@/common/utils/authorize";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { options as nextAuthOptions } from "@/options";
import CafeteriaMenuPresetPageComponent from "@/components/app/cafeteria/menu/preset/cafeteriaMenuPresetPage";

export const dynamic = "force-dynamic";
// メニューページ
// データ取得専用のサーバーコンポーネント
const CafeteriaMenuPreset: NextPage = async () => {
  const session = await getServerSession(nextAuthOptions);
  if (!authorize("ADMIN", session)) {
    return notFound();
  }
  // カテゴリーごとの日替わりメニューを取得
  const categoriesAndDailyMenus = await prisma.menuCategory.findMany({
    select: {
      id: true,
      categoryHandle: true,
      categoryName: true,
      index: true,
      menus: {
        where: {
          isDaily: true,
        },
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

  const aWeekAgo = new Date(Date.now());
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);

  const presetInfos = await prisma.presetInfo.findMany({
    where: {
      createdAt: {
        //一週間前までに作られたものだけ探せば大丈夫
        //今の機能だと1週間先以上は編集できないから
        gte: aWeekAgo,
      },
    },
    select: {
      id: true,
      year: true,
      month: true,
      date: true,
      presetMenus: {
        select: {
          id: true,
          menuId: true,
          contents: true,
        },
      },
    },
  });

  return (
    <CafeteriaMenuPresetPageComponent
      categories={categoriesAndDailyMenus}
      presetInfos={presetInfos}
    />
  );
};

export default CafeteriaMenuPreset;
