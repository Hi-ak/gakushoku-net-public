import { NextPage } from "next";
import { PaypayRedirectPageContent } from "../redirect";
import { prisma } from "@/common/utils/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/options";

const PaypayRedirectPage: NextPage<{
  params: { merchantPaymentId: string };
}> = async ({ params }) => {
  const session = await getServerSession(options);
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      cafeteriaId: true,
      id: true,
    },
  });
  return (
    <PaypayRedirectPageContent
      params={params}
      cafeteriaId={user.cafeteriaId}
      userId={user.id}
    />
  );
};

export default PaypayRedirectPage;
