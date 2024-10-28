"use client";
import { Ticket } from "@/common/types/ticket";
import { Receipt } from "@/common/types/receipt";
import styles from "@/common/styles/app/menu/menu.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HistoryTicketCard } from "@/components/cards/historyTicketCard";
import Link from "next/link";
import { TicketStatus } from "@prisma/client";

export interface HistoryTicket {
  menuRelation: {
    title: string;
    price: number;
  };
  options: {
    choiceRelation: {
      isDefault: boolean;
      choiceName: string;
      priceDiff: number;
      choiceHandle: string;
    };
    ticketId: string;
  }[];
  id: string;
  status: TicketStatus;
  createdAt: Date;
}
[];
/**
 * 表示用のメニューページ
 * メニューページの本体と言っても過言ではない
 */
export const HistoryPageComponent: React.FC<{
  myTickets: HistoryTicket[];
}> = ({ myTickets }) => {
  //ユーザーが使用すると選択したチケットたち
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [modalActive, setModalActive] = useState<boolean>(false);

  const orderingTicket = myTickets.filter((t) => t.status === "ORDERED");

  useEffect(() => {
    if (modalActive === false) {
      setSelectedTickets([]);
    }
  }, [modalActive]);

  return (
    <div className={styles.menu}>
      <div className={styles.menuContainerWrapper}>
        {orderingTicket.length > 0 ? (
          <div className="mt-7 flex flex-col items-center">
            <div className="bg-[yellow]">
              <a
                href={`#${orderingTicket[0].id}`}
                className="text-[red] underline"
              >
                正常に注文できなかった食券
              </a>
              があります。
            </div>
          </div>
        ) : null}
        <div className={["flex flex-col gap-4 p-10"].join(" ")}>
          {myTickets.length > 0 ? (
            <>
              {myTickets.map((ticket) => (
                <HistoryTicketCard key={ticket.id} ticket={ticket} />
              ))}
            </>
          ) : (
            <>
              <p>購入履歴がありません。</p>
              <p>
                <Link href="/menu">メニュー</Link>から購入してください。
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPageComponent;
