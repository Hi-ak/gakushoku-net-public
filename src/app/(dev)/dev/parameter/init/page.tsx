import { authorize } from "@/common/utils/authorize";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { ParameterInitPageContent } from "./parameterInit";
import { prisma } from "@/common/utils/prisma";

export default async function ParameterInitPage() {
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

  return (
    <ParameterInitPageContent
      cafeteriaHandle={user.cafeteriaRelation.orgHandle}
    />
  );
}
