import { prisma } from "@/common/utils/prisma";

export const getPriceAfterTax = (priceBeforeTax: number, taxRate: number) => {
  //tax rateは8とか10とか
  return Math.round(priceBeforeTax * (1 + taxRate / 100));
};

export const getTaxSettings = async () => {
  const taxSettings = (
    await prisma.taxSettings.findMany({
      where: {
        startAt: {
          lt: new Date(Date.now()),
        },
      },
      select: {
        id: true,
        taxRate: true,
        startAt: true,
      },
      orderBy: {
        //最新の一つを取る
        startAt: "desc",
      },
      take: 1,
    })
  )[0];

  return taxSettings;
};
