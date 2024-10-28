"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/common/styles/app/cafeteria/sales.module.scss";

import { jsonFetch } from "@/common/utils/customFetch";
import { MonthSelectPulldown } from "@/components/pulldowns/monthSelectPulldown";
import { UseDownloadSalesResponse } from "@/app/api/sales/download/route";
import { DownloadButton } from "@/components/buttons/DownloadButton";
/**
 * 表示用のメニューページ
 * メニューページの本体と言っても過言ではない
 */
const SalesPageComponent: React.FC<{}> = ({}) => {
  //ユーザーが使用すると選択したチケットたち
  var now = new Date(Date.now());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    now.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());

  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <div className={styles.sales}>
      <h3 className={styles.title}>売上データ管理</h3>
      <div className={styles.downloader}>
        <MonthSelectPulldown
          fromYear={2024}
          fromMonth={6}
          toYear={now.getFullYear()}
          toMonth={now.getMonth() + 1}
          order="desc"
          setYear={setSelectedYear}
          setMonth={setSelectedMonth}
        />

        {/*

      <button
        onClick={async () => {
          const res = await jsonFetch("/api/sales/save?y=2024&m=7", "GET");
          const data = (await res.json()) as UseSaveSalesResponse;
        }}
      >
        売上データを生成
      </button>
      */}

        <DownloadButton
          isDownloading={isDownloading}
          onClick={async () => {
            setIsDownloading(true);
            const res = await jsonFetch(
              `/api/sales/download?y=${selectedYear}&m=${selectedMonth}`,
              "GET"
            );
            const data = (await res.json()) as UseDownloadSalesResponse;

            console.log(data);

            if (data.additionalData.signedUrl) {
              const link = document.createElement("a");
              // link.download = data.additionalData.publicUrl;
              //t=をつけないと、キャッシュされた前のファイルが届くことがある（？）
              link.href = data.additionalData.signedUrl + `&t=${Date.now()}`;

              link.click();
              link.remove();
              setIsDownloading(false);
            }
          }}
          text="売上データをダウンロード"
        />
      </div>
    </div>
  );
};

export default SalesPageComponent;
