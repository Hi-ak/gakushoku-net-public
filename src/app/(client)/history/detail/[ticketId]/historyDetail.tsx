"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { HistoryDetailTicket } from "./page";
import { HistoryDetailTicketCard } from "@/components/cards/historyDetailCard";
import Link from "next/link";
import { jsonFetch } from "@/common/utils/customFetch";
import { UsedPostRequestBody } from "@/app/api/ticket/used/route";
import { ApiResponse } from "@/common/types/apiResponse";
import { RevertPostRequestBody } from "@/app/api/ticket/revert/route";

const Button = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) => {
  return (
    <div
      {...props}
      className={[
        "border-2 border-[black] py-1 px-2 rounded-[10px] cursor-pointer select-none",
        props.className,
      ].join(" ")}
    ></div>
  );
};

export const HistoryDetailPageComponent: React.FC<{
  ticketData: HistoryDetailTicket;
}> = ({ ticketData }) => {
  const router = useRouter();
  return (
    <div className="p-5 bg-menuBackground grow flex flex-col gap-4">
      {/* TODO: あとで別コンポーネントに */}
      {ticketData.status === "ORDERED" ? (
        <div className="my-20 flex flex-row items-center justify-around rounded-[16px] py-[10px] text-[blue] border-brown/50 border-[3px] flex-wrap gap-4 px-2">
          <div>
            <span>この食券は正常に使用できましたか？</span>
            <br />
            <span className="text-xs">
              料理を受け取ることができた場合は「正常に使用できた」を、受け取ることができなかった場合はそのままにしてください。
            </span>
          </div>
          <div className="flex flex-row gap-3">
            <Button
              className="bg-green/25 text-[black]"
              onClick={async () => {
                const con = confirm(
                  "この食券を使用済みにしますか？\n料理を受け取ることができなかった場合はキャンセルを押してください"
                );
                if (!con) return;
                const res = await jsonFetch("/api/ticket/used", "POST", {
                  ticketIds: [ticketData.id],
                } as UsedPostRequestBody);
                const resJson: ApiResponse = await res.json();
                console.log(resJson);
                if (resJson.success) {
                  alert("使用済みにしました");
                } else if (!resJson.success) {
                  alert("エラーが発生しました");
                }
                router.refresh();
              }}
            >
              正常に使用できた
            </Button>
          </div>
        </div>
      ) : null}
      <HistoryDetailTicketCard ticket={ticketData} />
      <Link href={`/history`}>
        <div className="rounded-[16px] py-[10px] bg-subPrimaryLight border-brown/50 border-[3px] text-center cursor-pointer select-none">
          <span className="text-[black]">←　履歴一覧へ</span>
        </div>
      </Link>
    </div>
  );
};

export default HistoryDetailPageComponent;
