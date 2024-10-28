import { prisma } from "@/common/utils/prisma";
import CafeteriaOptionListPageComponent from "@/components/app/cafeteria/option/list/cafeteriaOptionListPage";
import { NextPage } from "next";
import { getServerSession } from "next-auth";
import { options as nextAuthOptions } from "@/options";
import { authorize } from "@/common/utils/authorize";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CafeteriaOptionList: NextPage = async () => {
  const session = await getServerSession(nextAuthOptions);
  if (!( authorize("ADMIN", session))) {
    return notFound();
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.userId,
    },
    select: {
      cafeteriaId: true,
    },
  });
  const options = await prisma.menuOption.findMany({
    where: {
      cafeteriaId: user.cafeteriaId,
    },
    select: {
      cafeteriaId: true,
      id: true,
      optionHandle: true,
      optionName: true,
      priority: true,
      choiceList: {
        select: {
          id: true,
          choiceHandle: true,
          choiceName: true,
          priceDiff: true,
          isDefault: true,
          index: true,
        },
        orderBy: {
          index: "asc",
        },
      },
      choiceNum: true,
      menus: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      priority: "asc",
    },
  });

  return <CafeteriaOptionListPageComponent options={options} />;
};

export default CafeteriaOptionList;
