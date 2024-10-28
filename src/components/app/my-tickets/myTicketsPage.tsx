"use client";
import { Ticket } from "@/common/types/ticket";
import styles from "@/common/styles/app/menu/menu.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { TicketCard } from "@/components/cards/ticketCard";
import { CancelButton } from "@/components/menu/menuButtons";
import { OrderButton } from "@/components/my-tickets/myTicketsButtons";
import { SmallAlert } from "@/components/modals/alert";
import { Modal } from "@/components/modals/modal";
import { OrderModalContent } from "@/components/my-tickets/orderModal";
import { useRouter } from "next/navigation";
import { jsonFetch } from "@/common/utils/customFetch";
import type {
  OrderPostResponseBody,
  OrderPostRequestBody,
} from "@/app/api/ticket/order/route";
import Link from "next/link";
import NoSleep from "nosleep.js";

/**
 * 表示用のメニューページ
 * メニューページの本体と言っても過言ではない
 */
const MyTicketsPageComponent: React.FC<{
  myTickets: Ticket[];
  isOperating: boolean; //ここでは/menuと違いちがい、土日判定のみ
  orderDuration: number;
}> = ({ myTickets, isOperating, orderDuration }) => {
  //ユーザーが使用すると選択したチケットたち
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [modalActive, setModalActive] = useState<boolean>(false);
  const [expireDateTime, setExpireDateTime] = useState<number>(0);
  const [fetchingOrder, setFetchingOrder] = useState<boolean>(false);
  const nosleepRef = useRef<NoSleep>(null);
  const duration = orderDuration;
  const router = useRouter();
  // const [now, setNow] = useState(new Date());

  useEffect(() => {
    nosleepRef.current = new NoSleep();
    return () => {
      nosleepRef.current.disable();
    };
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setNow(new Date());
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // });

  useEffect(() => {
    if (modalActive === false) {
      setSelectedTickets([]);
      nosleepRef.current.disable();
    } else {
      nosleepRef.current.enable();
    }
  }, [modalActive]);

  useEffect(() => {
    console.log("mounted");
    return () => {
      console.log("unmounted");
    };
  }, []);

  return (
    <div className={styles.menu}>
      <div
        className={[
          styles.menuContainerWrapper,
          "flex flex-col items-center",
        ].join(" ")}
        // className={[styles.menuContainerWrapper].join(" ")}
      >
        <h1 className="text-3xl mt-5">購入済み食券一覧</h1>
        <div className="px-5 text-[gray] font-normal text-base w-full text-center">
          {!isOperating ? (
            <>
              <p>営業時間外のため、注文することはできません。</p>
              <p>期限を過ぎた食券は自動で返金されます。</p>
              <hr />
            </>
          ) : null}
        </div>
        <div className={styles.menuContainer}>
          {myTickets.length ? (
            myTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                selectedTickets={selectedTickets}
                setSelectedTickets={setSelectedTickets}
                disabled={!isOperating}
              />
            ))
          ) : (
            <>
              <p>まだ食券を購入していません。</p>
              <p>
                <Link href="/menu">メニュー</Link>から購入してください。
              </p>
            </>
          )}
        </div>
      </div>
      <div className={styles.warningTextContainer}>
        <h3 className={styles.warningText}>
          ↓配膳の列に並んでから↓
          <br />
          注文ボタンを押してください
        </h3>
      </div>
      <div className={styles.bottom}>
        {isOperating ? (
          <OrderButton
            onClick={async () => {
              if (selectedTickets.length === 0) {
                return;
              }
              if (fetchingOrder) {
                return;
              }
              setFetchingOrder(true);
              if (!confirm("注文しますか？")) {
                setFetchingOrder(false);
                return;
              }
              const res = await jsonFetch("/api/ticket/order", "POST", {
                ticketIds: selectedTickets.map((ticket) => ticket.id),
              } as OrderPostRequestBody);
              const resJson = (await res.json()) as OrderPostResponseBody;
              if (!res.ok || !resJson.success) {
                alert("何かのエラーが発生しました。");
                setFetchingOrder(false);
                return;
              }
              setFetchingOrder(false);
              router.refresh();
              setExpireDateTime(new Date().getTime() + duration);
              setModalActive(true);
            }}
            itemNum={selectedTickets.length}
            className={selectedTickets.length === 0 ? styles.disabled : ""}
          />
        ) : (
          <>現在は注文できません</>
        )}
      </div>
      <Modal noShadowClose active={modalActive} setActive={setModalActive}>
        <OrderModalContent
          key={expireDateTime}
          expireDateTime={expireDateTime || null}
          tickets={selectedTickets}
          setModalActive={setModalActive}
          noSleep={nosleepRef.current}
          duration={duration}
        />
      </Modal>
    </div>
  );
};

export default MyTicketsPageComponent;
