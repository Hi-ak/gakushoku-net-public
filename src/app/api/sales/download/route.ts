import { ApiResponse } from "@/common/types/apiResponse";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../supabase";
import { prisma } from "@/common/utils/prisma";
import { exportSalesData } from "../excelExporter";

import { Ticket } from "@/common/types/ticket";
import * as fs from "fs";
import { logAPI } from "@/common/utils/logger";
import { logger } from "@/common/utils/logger";
import {
  getHourTimeDelta,
  getMinuteTimeDelta,
} from "@/common/var/cafeteriaTime";
import { authorize } from "@/common/utils/authorize";

export interface UseDownloadSalesResponse extends ApiResponse {
  additionalData: {
    signedUrl: string;
  };
}

export const GET = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "menu/purchase/cart" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const y = searchParams.get("y") as string;
  const m = searchParams.get("m") as string;
  const year = parseInt(y);
  const month = parseInt(m);

  if (year < 2000 || year > 2100 || month < 1 || month > 12) {
    return NextResponse.json({
      success: false,
      code: 400,
      message: "BAD REQUEST",
    });
  }

  const salesExportHistory = await getSalesExportHistory(year, month);

  if (!salesExportHistory || salesExportHistory?.status == "PARTIAL") {
    const result = await saveSales2Supabase(year, month, session.user.email);
    if (result.error) {
      logger.error({ at: "sales/download", error: result.error }, "ERROR");
      return NextResponse.json({
        success: false,
        code: 500,
        message: `${year}年${month}月のデータURLを取得できませんでした`,
      });
    }
    const result2 = await prisma.salesExportHistory.upsert({
      where: {
        year_month: {
          year: year,
          month: month,
        },
      },
      update: {
        status: checkIfPartial(year, month) ? "PARTIAL" : "COMPLETED",
        updatedAt: new Date(Date.now()),
      },
      create: {
        year: year,
        month: month,
        status: checkIfPartial(year, month) ? "PARTIAL" : "COMPLETED",
      },
    });
  }

  const signedUrl = await getSupabaseSignedURL(year, month, session.user.email);
  return NextResponse.json({
    success: true,
    code: 200,
    message: `正常に${year}年${month}月のデータURLを取得しました`,
    additionalData: {
      signedUrl,
    },
  } as UseDownloadSalesResponse);
};

const getSalesExportHistory = async (year: number, month: number) => {
  const result = await prisma.salesExportHistory.findUnique({
    where: {
      year_month: {
        year: year,
        month: month,
      },
    },
    select: {
      id: true,
      year: true,
      month: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getSupabaseSignedURL = async (
  year: number,
  month: number,
  email: string
) => {
  const supabase = await getSupabase(email);

  var { data, error } = await supabase.storage
    .from("sales")
    .createSignedUrl(`/${year}-${month}.xlsx`, 60);
  logger.debug({ at: "sales/download", signedUrl: data.signedUrl });
  return data.signedUrl;
};

const saveSales2Supabase = async (
  year: number,
  month: number,
  email: string
) => {
  const from = new Date(year, month - 1);
  const hourTimeDelta = await getHourTimeDelta("kaisei");
  const minuteTimeDelta = await getMinuteTimeDelta("kaisei");
  from.setUTCHours(
    from.getUTCHours() + hourTimeDelta,
    from.getUTCMinutes() + minuteTimeDelta
  );
  const to = new Date(year, month);
  to.setUTCHours(
    to.getUTCHours() + hourTimeDelta,
    to.getUTCMinutes() + minuteTimeDelta
  );

  const soldTickets = await prisma.ticket.findMany({
    where: {
      status: "USED",
      createdAt: {
        gte: from,
        lt: to,
      },
    },
    select: {
      menuRelation: {
        select: {
          id: true,
          title: true,
          price: true,
          categoryHandle: true,
        },
      },
      options: {
        select: {
          id: true,
          optionRelation: {
            select: {
              id: true,
            },
          },
          choiceRelation: {
            select: {
              id: true,
              choiceName: true,
              priceDiff: true,
              isDefault: true,
              choiceHandle: true,
            },
          },
          ticketId: true,
        },
      },
      createdAt: true,
    },
  });

  // logger.debug({ at: "sales/download", soldTickets });

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

  const menuOptions = await prisma.menuOption.findMany({
    select: {
      id: true,
      optionName: true,
      optionHandle: true,
      choiceNum: true,
      choiceList: {
        select: {
          id: true,
          choiceName: true,
          priceDiff: true,
          isDefault: true,
          choiceHandle: true,
        },
      },
    },
  });

  const filePath = await exportSalesData(
    categoriesAndMenus,
    menuOptions,
    soldTickets as Ticket[],
    year,
    month
  );

  var arrayBuffer = toArrayBuffer(fs.readFileSync(filePath));

  const supabase = await getSupabase(email);
  const result = await supabase.storage
    .from("sales")
    .upload(`/${year}-${month}.xlsx`, arrayBuffer, {
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      upsert: true,
      cacheControl: "0",
    });

  //tempファイルを削除
  fs.rmSync(filePath);

  return result;
};

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

//月の途中かチェック
function checkIfPartial(year: number, month: number) {
  const now = new Date(Date.now());
  return now.getFullYear() == year && now.getMonth() + 1 == month;
}
