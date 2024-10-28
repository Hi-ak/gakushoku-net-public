import { NextPage } from "next";
import { ManualRefundPageContent } from "./manualRefund";
import { authorize } from "@/common/utils/authorize";
import { getServerSession } from "next-auth";
import { options } from "@/options";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const ManualRefundPage: NextPage = async () => {
  const session = await getServerSession(options);
  if (!(await authorize("DEV", session))) {
    return notFound();
  }
  return <ManualRefundPageContent />;
};

export default ManualRefundPage;
