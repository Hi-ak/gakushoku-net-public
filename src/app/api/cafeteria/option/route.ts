import { ApiResponse } from "@/common/types/apiResponse";
import { authorize } from "@/common/utils/authorize";
import { logAPI, logger } from "@/common/utils/logger";
import { prisma } from "@/common/utils/prisma";
import { options } from "@/options";
import { OptionChoice } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface OptionPutBodyChoice {
  id: string | null;
  choiceHandle: string;
  choiceName: string;
  priceDiff: number;
  isDefault: boolean;
  index: number;
}

export interface OptionPostBodyOption {
  optionHandle: string;
  optionName: string;
  cafeteriaId: string;
  choiceNum: number;
  priority: number;
}

export interface OptionPostBody {
  newOption: OptionPostBodyOption;
}

export interface OptionPutBody extends OptionPostBodyOption {
  id: string;
  choiceList: OptionPutBodyChoice[];
}

export interface OptionPostResponse extends ApiResponse {
  additionalData: {
    option: {
      id: string;
    };
  };
}

export interface OptionDeleteBody {
  id: string;
}

export const POST = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/option", method: "POST" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const { newOption }: OptionPostBody = await req.json();
  try {
    const option = await prisma.menuOption.create({
      data: {
        optionHandle: newOption.optionHandle,
        optionName: newOption.optionName,
        cafeteriaId: newOption.cafeteriaId,
        choiceNum: newOption.choiceNum,
        priority: newOption.priority,
      },
    });
    const res = NextResponse.json({
      success: true,
      message: "正常にオプションが追加されました。",
      additionalData: {
        option,
      },
      code: 200,
    } as OptionPostResponse);
    return res;
  } catch (e) {
    // TODO: エラーの code を決める
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        const res = NextResponse.json({
          success: false,
          message: "オプション名が重複しています。",
          code: 400,
        } as ApiResponse);
        return res;
      }
    }
    const res = NextResponse.json({
      success: false,
      message: "エラーが発生しました。",
      code: 500,
    } as ApiResponse);
    return res;
  }
};

export const PUT = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/option", method: "PUT" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const option: OptionPutBody = await req.json();
  const choices = await prisma.optionChoice.findMany({
    where: {
      menuOptionHandle: option.optionHandle,
      cafeteriaId: option.cafeteriaId,
    },
  });
  option.choiceList = option.choiceList.map((c, i) => {
    return {
      ...c,
      index: i,
    };
  });
  const newChoices: OptionPutBodyChoice[] = [];
  const updateChoices: OptionPutBodyChoice[] = [];
  const deleteChoices: string[] = [...choices.map((choice) => choice.id)];
  const cantDelete: string[] = [];
  for (const choice of option.choiceList) {
    if (choice.id === null) {
      newChoices.push(choice);
    } else {
      updateChoices.push(choice);
      deleteChoices.splice(deleteChoices.indexOf(choice.id), 1);
    }
  }
  await Promise.all(
    updateChoices.map((choice) =>
      prisma.optionChoice.update({
        where: {
          id: choice.id,
        },
        data: {
          choiceHandle: choice.choiceHandle,
          choiceName: choice.choiceName,
          priceDiff: choice.priceDiff,
          isDefault: choice.isDefault,
          index: choice.index,
        },
      })
    )
  );
  try {
    await Promise.all(
      deleteChoices.map((id) =>
        prisma.optionChoice.delete({
          where: {
            id,
          },
        })
      )
    );
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
    }
  }
  await prisma.menuOption.update({
    where: {
      id: option.id,
    },
    data: {
      optionHandle: option.optionHandle,
      optionName: option.optionName,
      choiceNum: option.choiceNum,
      priority: option.priority,
      choiceList: {
        createMany: {
          data: newChoices.map((choice) => ({
            choiceHandle: choice.choiceHandle,
            choiceName: choice.choiceName,
            priceDiff: choice.priceDiff,
            isDefault: choice.isDefault,
            index: choice.index,
          })),
        },
      },
    },
  });

  const res = NextResponse.json({
    success: true,
    message: "正常にオプションが更新されました。",
    additionalData: {
      option,
    },
    code: 200,
  } as ApiResponse);
  return res;
};

export const DELETE = async (req: NextRequest) => {
  logAPI(req);
  const session = await getServerSession(options);
  if (!(await authorize("ADMIN", session))) {
    logger.debug({ at: "cafeteria/option", method: "DELETE" }, "unauthorized");
    return NextResponse.json("UNAUTHORIZED", { status: 401 });
  }
  const { id }: OptionDeleteBody = await req.json();
  await prisma.menuOption.delete({
    where: {
      id,
    },
  });
  const res = NextResponse.json({
    success: true,
    message: "正常にオプションが削除されました。",
    code: 200,
  } as ApiResponse);
  return res;
};
