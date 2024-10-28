import { ApiResponse } from "@/common/types/apiResponse";
import { ServiceStatus } from "@/common/types/menu";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { Menu } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface MenuPostBodyMenu {
  title: string;
  price: number;
  availableQuantity: number;
  categoryHandle: string;
  contents: string[];
  defaultQuantity: number;
  serviceStatus: ServiceStatus;
  backgroundImageURL: string;
  cafeteriaId: string;
  isDaily: boolean;
}

export interface MenuPostBody {
  newMenu: MenuPostBodyMenu;
}

export interface MenuPutBody extends MenuPostBodyMenu {
  id: string;
  options: {
    optionHandle: string;
  }[];
}

export interface MenuPostResponse {
  additionalData: {
    menu: Menu;
  };
}

export interface MenuDeleteBody {
  id: string;
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/menu", method: "POST" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const { newMenu }: MenuPostBody = await req.json();
  const menu = await prisma.menu.create({
    data: {
      title: newMenu.title,
      price: newMenu.price,
      availableQuantity: newMenu.availableQuantity,
      category: {
        connect: {
          categoryHandle_cafeteriaId: {
            categoryHandle: newMenu.categoryHandle,
            cafeteriaId: newMenu.cafeteriaId,
          },
        },
      },
      contents: newMenu.contents,
      defaultQuantity: newMenu.defaultQuantity,
      serviceStatus: newMenu.serviceStatus,
      backgroundImageURL: newMenu.backgroundImageURL,
      cafeteriaRelation: {
        connect: {
          id: newMenu.cafeteriaId,
        },
      },
    },
  });
  const res = NextResponse.json({
    success: true,
    message: "正常にメニューが追加されました。",
    code: 200,
    additionalData: {
      menu,
    },
  } as ApiResponse);
  return res;
};

export const PUT = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/menu", method: "PUT" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const newMenu: MenuPutBody = await req.json();
  const menu = await prisma.menu.update({
    where: { id: newMenu.id },
    data: {
      title: newMenu.title,
      price: newMenu.price,
      availableQuantity: newMenu.availableQuantity,
      categoryHandle: newMenu.categoryHandle,
      contents: newMenu.contents,
      defaultQuantity: newMenu.defaultQuantity,
      serviceStatus: newMenu.serviceStatus,
      backgroundImageURL: newMenu.backgroundImageURL,
      options: {
        set: newMenu.options.map((o) => ({
          optionHandle_cafeteriaId: {
            optionHandle: o.optionHandle,
            cafeteriaId: newMenu.cafeteriaId,
          },
        })),
      },
      isDaily: newMenu.isDaily,
    },
  });
  const res = NextResponse.json({
    success: true,
    message: "正常にメニューが更新されました。",
    code: 200,
    additionalData: {
      menu,
    },
  } as ApiResponse);
  return res;
};

export const DELETE = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/menu", method: "DELETE" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const { id }: MenuDeleteBody = await req.json();
  const menu = await prisma.menu.delete({
    where: { id },
  });
  const res = NextResponse.json({
    success: true,
    message: "正常にメニューが削除されました。",
    code: 200,
    additionalData: {
      menu,
    },
  } as ApiResponse);
  return res;
};
