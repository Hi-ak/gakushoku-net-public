"use client";
import React from "react";

import styles from "@/common/styles/components/cards/menuCard.module.scss";
import {
  getDate,
  getLocaleDay,
  getLocaleTime,
  getTime,
} from "@/common/utils/datetime";
import { totalPriceFromCart } from "@/common/utils/cart";
import { HistoryTicket } from "@/app/(client)/history/historyPage";
import {
  localizedTicketStatus,
  tickeStatusColorBind,
} from "@/common/types/ticket";
import Link from "next/link";

/**
 * 購入済みチケットで表示する食券のコンポーネント
 */
export const HistoryTicketCard: React.FC<{ ticket: HistoryTicket }> = ({
  ticket,
}) => {
  const totalPrice = totalPriceFromCart([
    {
      menuPrice: ticket.menuRelation.price,
      options: ticket.options.map((opt) => ({
        priceDiff: opt.choiceRelation.priceDiff,
      })),
      quantity: 1,
    },
  ]);

  const options = ticket.options.filter((opt) => !opt.choiceRelation.isDefault);

  return (
    <>
      {ticket.status === "ORDERED" ? (
        <div className="text-center text-sm flex flex-row items-center relative text-[red] bg-[yellow] px-2 py-1 h-10 top-[1rem] w-[fit-content]">
          この食券は前回正常に使用されませんでした。
          <br />
          詳細をチェックしてください。
        </div>
      ) : null}
      <div
        id={ticket.id}
        className={`${styles.cardContainer} ${styles.receiptCardContainer}`}
      >
        <div
          className={`${styles.titleAndPrice} ${styles.titleAndPrice__receipt}`}
        >
          <h2 className={styles.title}>
            <Link
              href={`/history/detail/${ticket.id}`}
              className="text-[black] underline"
            >
              {`${getDate(ticket.createdAt)}(${getLocaleDay(
                ticket.createdAt
              )}) ${getLocaleTime(ticket.createdAt)}`}
            </Link>
          </h2>
        </div>
        <div
          className={[styles.titleAndPrice, styles.titleAndPriceSmall].join(
            " "
          )}
        >
          <Link
            href={`/history/detail/${ticket.id}`}
            className="text-[black] underline"
          >
            <h2 className={styles.title}>{`${getDate(
              ticket.createdAt,
              "month"
            )} ${getTime(ticket.createdAt)}`}</h2>
          </Link>
        </div>
        <div className="flex flex-row justify-around items-center p-4 gap-2">
          <div className="grow-[2] shrink text-center">
            {ticket.menuRelation.title +
              (options.length > 0
                ? `（${options
                    .map((opt) => opt.choiceRelation.choiceName)
                    .join("・")}）`
                : "")}
          </div>
          <div className="grow-[2] shrink text-center">{totalPrice}円</div>
          <div
            className={`grow-[1] text-center`}
            style={{
              color: tickeStatusColorBind[ticket.status],
            }}
          >
            {localizedTicketStatus[ticket.status]}
          </div>
        </div>
      </div>
    </>
  );
};
