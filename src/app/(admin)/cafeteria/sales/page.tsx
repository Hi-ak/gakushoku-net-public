import { prisma } from "@/common/utils/prisma";
import { Ticket } from "@/common/types/ticket";
import { Receipt } from "@/common/types/receipt";
import { NextPage } from "next";
import React from "react";

import SalesPageComponent from "@/components/app/cafeteria/sales/salesPage";
import { authorize } from "@/common/utils/authorize";
import { notFound } from "next/navigation";
import { options } from "@/options";
import { getServerSession } from "next-auth";

import { jsonFetch } from "@/common/utils/customFetch";
export const dynamic = "force-dynamic";

// ユーザーの購入済情報（Receiptオブジェクト）をリスト表示するページ
const SalesPage: NextPage = async () => {
  const session = await getServerSession(options);
  if (!authorize("ADMIN", session)) {
    return notFound();
  }
  //古いものはTwitterみたいに後から更新する仕組み等必要かも（レコードが増えたら遅くなりそう）

  return <SalesPageComponent />;
};

export default SalesPage;
