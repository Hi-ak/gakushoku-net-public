"use client";
import type { PurchaseRequestDataBody } from "@/app/api/menu/purchase/route";
import { jsonFetch } from "@/common/utils/customFetch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const PaypayRedirectPageContent: React.FC<{
  params: { merchantPaymentId: string };
  cafeteriaId: string;
  userId: string;
}> = ({ params, cafeteriaId, userId }) => {
  const router = useRouter();

  useEffect(() => {
    const abortController = new AbortController();
    jsonFetch(
      "/api/menu/purchase",
      "POST",
      {
        paymentType: "PAYPAY",
        merchantPaymentId: params.merchantPaymentId,
      } as PurchaseRequestDataBody,
      { signal: abortController.signal }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          router.push("/my-tickets");
        } else {
          alert(`エラーが発生しました: ${data.message}`);
        }
      })
      .catch((e) => {
        console.error(e);
        if (e == "for strict mode") {
          return;
        }
        alert("エラーが発生しました: " + e);
        router.push("/my-tickets");
      });
    return () => {
      abortController.abort("for strict mode");
    };
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-10 p-10">
      <div className="text-3xl text-center">
        <h3>決済処理中です</h3>
        <br />
        <br />
        <h4>⚠️画面を閉じないでください⚠️</h4>
      </div>
    </div>
  );
};
