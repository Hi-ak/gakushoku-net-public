"use client";
import {
  ManualRefundPostRequestBody,
  ManualRefundPostResponseBody,
} from "@/app/api/dev/manual-refund/route";
import { jsonFetch } from "@/common/utils/customFetch";
import { useRef, useState } from "react";

export const ManualRefundPageContent: React.FC = () => {
  const paymentIdRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<ManualRefundPostResponseBody[]>([]);

  return (
    <div className="px-[10%] py-[30px] grow flex flex-col">
      <h2 className="my-5">手動返金ページ</h2>
      <div className="flex flex-col items-start gap-4">
        <div className="w-full">
          決済ID:
          <input
            ref={paymentIdRef}
            type="number"
            className="ml-2 border-2 p-1 rounded-lg grow w-full max-w-[240px]"
            placeholder="決済ID"
          />
        </div>
        <div>
          金額（任意：部分返金の場合のみ）:
          <br />
          <input
            ref={amountRef}
            type="number"
            className="mt-1 border-2 p-1 rounded-lg grow max-w-[240px]"
            placeholder="000"
          />
          円
        </div>
        <button
          onClick={async () => {
            const paymentId = paymentIdRef.current?.value;
            const amount = parseInt(amountRef.current?.value);
            const res = await jsonFetch("/api/dev/manual-refund", "POST", {
              paymentId,
              amount: isNaN(amount) ? undefined : amount,
            } as ManualRefundPostRequestBody);
            const data = (await res.json()) as ManualRefundPostResponseBody;
            setData((prev) => [...prev, data]);
          }}
          className="border-2 rounded-lg px-2 py-1 bg-gray/50 hover:bg-gray/25"
        >
          返金
        </button>
      </div>
      <h2 className="my-4">返金ステータス</h2>
      <div className="flex flex-col gap-4">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border-2 rounded-[20px] p-[10px]"
          >
            <div>決済ID: {d.additionalData.paymentId}</div>
            <div>
              返金額: {d.additionalData.amount || "全額"}
              {d.additionalData.amount ? "円" : null}
            </div>
            <div>ステータス: {d.success ? "成功" : "失敗"}</div>
            <div>メッセージ: {d.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
