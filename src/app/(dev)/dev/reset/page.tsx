import { NumberedRole } from "@/common/enums/role";
import { authorize } from "@/common/utils/authorize";
import { options } from "@/options";
import { NextPage } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { ResetPageContent } from "./reset";

const DevResetPage: NextPage = async () => {
  if (process.env.NODE_ENV !== "development") {
    return notFound();
  }
  const session = await getServerSession(options);
  if (!authorize("DEV", session)) {
    return notFound();
  }
  return (
    <ResetPageContent />
  );
};

export default DevResetPage;
