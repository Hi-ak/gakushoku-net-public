import { UsedPostRequestBody } from "@/app/api/ticket/used/route";
import styles from "@/common/styles/components/my-tickets/orderModal.module.scss";
import { ApiResponse } from "@/common/types/apiResponse";
import { Ticket } from "@/common/types/ticket";
import { jsonFetch } from "@/common/utils/customFetch";
import { getLocaleDateTime, getLocaleTime } from "@/common/utils/datetime";
import { barColor } from "@/common/var/barColor";
import { useRouter } from "next/navigation";
import NoSleep from "nosleep.js";
import React from "react";
import { useEffect, useRef, useState } from "react";

type Status = "waiting" | "success" | "failure";
const blink = 500;

// TODO: 時間切れによる失効か受取済みによる失効かの場合分けを作成する。
export const OrderModalContent: React.FC<{
  tickets: Ticket[];
  expireDateTime: number | null;
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  noSleep: NoSleep;
  duration: number;
}> = ({ tickets, expireDateTime, setModalActive, noSleep, duration }) => {
  const [status, setStatus] = useState<Status>("waiting");
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout>();
  const modalRef = useRef<HTMLDivElement>(null);
  const stoppedRef = useRef<number>(null);
  const router = useRouter();
  const [receiving, setReceiving] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, blink);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (modalRef.current) {
      const ele = modalRef.current;
      if (ele.scrollHeight > ele.clientHeight) {
        ele.classList.add(styles.scrollable);
      }
    }
  }, []);

  useEffect(() => {
    if (expireDateTime && now >= expireDateTime && status === "waiting") {
      setStatus("failure");
    }
  }, [now, expireDateTime, setModalActive, router]);
  const timeDiff = expireDateTime - (stoppedRef.current ?? now);

  const todaysBarColor = barColor[new Date().getDay()];

  const blinkBar = (
    <div
      className={[
        "absolute top-0 right-0 h-[22px]",
        Math.round(now / blink) % 2 === 0
          ? `${todaysBarColor}`
          : `${todaysBarColor}/25`,
      ].join(" ")}
      style={{
        width: `${
          (timeDiff / duration) * 100 + (1 - timeDiff / duration) * 3
        }%`,
        transition: `width ${blink}ms linear, background-color ${blink}ms`,
      }}
    ></div>
  );

  return (
    <div className={[styles.orderModal, "relative"].join(" ")} ref={modalRef}>
      {status === "waiting" ? (
        <>
          {blinkBar}
          <div className={styles.expire}>
            <div className={styles.expireDate}>{`${getLocaleDateTime(
              expireDateTime
            )} まで`}</div>
            <div className={styles.duration}>
              残り時間：{Math.floor((timeDiff >= 0 ? timeDiff : 0) / 1000 / 60)}
              分{Math.floor((timeDiff >= 0 ? timeDiff : 0) / 1000) % 60}秒
            </div>
          </div>
          <div className={styles.contents}>
            <MenuList tickets={tickets} />
          </div>
          <div className={styles.buttonContainer}>
            <div
              className={[
                styles.button,
                styles.waiting,
                duration - timeDiff < 5000 ? styles.disabled : null,
              ].join(" ")}
              onClick={async () => {
                if (receiving) return;
                if (duration - timeDiff < 5000) {
                  alert(
                    "注文から5秒以内は誤タップ防止のため受け取りできません。"
                  );
                  return;
                }
                setReceiving(true);
                try {
                  const res = await jsonFetch(
                    "/api/ticket/used",
                    "POST",
                    {
                      ticketIds: tickets.map((t) => t.id),
                    } as UsedPostRequestBody,
                    { signal: AbortSignal.timeout(2000) }
                  );
                  const resJson: ApiResponse = await res.json();
                  console.log(resJson);
                  if (!resJson.success) {
                    alert(
                      "何かのエラーが発生しました。注文は完了しましたが、後に開発者にお問い合わせください。"
                    );
                  }
                } catch (e) {
                  console.error(e);
                  alert(
                    "通信環境が悪かったので正常に処理できませんでした。料理は受け取りください。\n後で購入履歴でもう一度使用済みにしてください。"
                  );
                }
                setReceiving(false);
                noSleep.disable();
                setStatus("success");
                stoppedRef.current = now;
              }}
            >
              受取済みにする
            </div>
          </div>
        </>
      ) : status === "success" ? (
        <>
          {blinkBar}
          <div className="flex flex-row flex-wrap justify-center gap-x-6 text-2xl">
            <span>受け取り時刻：{getLocaleTime(stoppedRef.current, true)}</span>
            <span>現在時刻：{getLocaleTime(now, true)}</span>
          </div>
          <div className={[styles.contents, styles.center].join(" ")}>
            受取済み
            <div className={styles.subContents}>
              ご利用ありがとうございました
            </div>
            <div>
              <MenuList tickets={tickets} className={styles.smallMenuList} />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <div
              className={[styles.button, styles.success].join(" ")}
              onClick={() => {
                setModalActive(false);
                intervalRef.current && clearInterval(intervalRef.current);
                router.push("/menu");
              }}
            >
              閉じる
            </div>
          </div>
        </>
      ) : status === "failure" ? (
        <>
          <div className="flex flex-row flex-wrap justify-center gap-x-6 text-2xl">
            <span>失効時刻：{getLocaleTime(expireDateTime, true)}</span>
            <span>現在時刻：{getLocaleTime(now, true)}</span>
          </div>
          <div className={[styles.contents, styles.center].join(" ")}>
            時間切れです
            <div>
              <MenuList tickets={tickets} className={styles.smallMenuList} />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <div
              className={[styles.button, styles.success].join(" ")}
              onClick={() => {
                setModalActive(false);
                intervalRef.current && clearInterval(intervalRef.current);
                router.push("/menu");
              }}
            >
              閉じる
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

const MenuList: React.FC<{ tickets: Ticket[]; className?: string }> = ({
  tickets,
  className = "",
}) => (
  <ul className={[className, styles.menuList].join(" ")}>
    {tickets.map((ticket) => {
      const options = ticket.options.filter(
        (option) => !option.choiceRelation.isDefault
      );
      return (
        <li key={ticket.id}>
          {ticket.menuRelation.title}
          {options.length > 0
            ? `（${options
                .map((option) => option.choiceRelation.choiceName)
                .join("・")}）`
            : ""}
        </li>
      );
    })}
  </ul>
);
