import { NextPage } from "next";
import { ParameterPageContent } from "./parameter";
import { prisma } from "@/common/utils/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/options";
import { authorize } from "@/common/utils/authorize";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ParameterPage: NextPage = async () => {
  const session = await getServerSession(options);
  if (!(await authorize("DEV", session))) {
    return notFound();
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      cafeteriaRelation: {
        select: {
          orgHandle: true,
        },
      },
    },
  });
  const cafeteriaHandle = user.cafeteriaRelation.orgHandle;
  const parameter = await prisma.parameter.findUnique({
    where: {
      cafeteriaHandle,
    },
  });
  const daySetting = await prisma.daySetting.findUnique({
    where: {
      cafeteriaHandle,
    },
  });
  if (!parameter || !daySetting) {
    return (
      <div>
        <Link href="/dev/parameter/init">初期化をしてください。</Link>
      </div>
    );
  }
  return (
    <ParameterPageContent
      cafeteriaHandle={cafeteriaHandle}
      parameter={parameter}
      daySetting={daySetting}
    />
  );
};

export default ParameterPage;
