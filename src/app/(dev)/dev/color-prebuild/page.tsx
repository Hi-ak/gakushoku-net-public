import { authorize } from "@/common/utils/authorize";
import { options } from "@/options";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function ColorPrebuild() {
  const session = await getServerSession(options);
  if (!(await authorize("DEV", session))) {
    return notFound();
  }
  return (
    <>
      <div className="bg-blue-500"></div>
      <div className="bg-blue-500/25"></div>
      <div className="bg-red-500"></div>
      <div className="bg-red-500/25"></div>
      <div className="bg-green"></div>
      <div className="bg-green/25"></div>
      <div className="bg-purple-500"></div>
      <div className="bg-purple-500/25"></div>
      <div className="bg-primary"></div>
      <div className="bg-primary/25"></div>
    </>
  );
}
