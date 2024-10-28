"use client";
import React, { ReactNode } from "react";

import styles from "@/common/styles/components/cards/menuCard.module.scss";
import { HistoryDetailTicket } from "@/app/(client)/history/detail/[ticketId]/page";
import {
  localizedTicketStatus,
  tickeStatusColorBind,
} from "@/common/types/ticket";
import { getDate, getTime } from "@/common/utils/datetime";
import Link from "next/link";

const InfoWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex flex-row gap-[10px]">{children}</div>;
};

const InfoTitle: React.FC<{ children?: ReactNode; left?: boolean }> = ({
  children,
  left = false,
}) => {
  return (
    <div
      className={[
        "w-[calc(50%-5px)] text-wrap overflow-auto",
        left ? "text-start" : "text-end",
      ].join(" ")}
    >
      {children}
    </div>
  );
};

const Info: React.FC<{ children?; right?: boolean }> = ({ children }) => {
  return (
    <div
      className={["w-[calc(50%-5px)] text-end text-wrap overflow-auto"].join(
        " "
      )}
    >
      {children}
    </div>
  );
};

export const HistoryDetailTicketCard: React.FC<{
  ticket: HistoryDetailTicket;
}> = ({ ticket }) => {
  return (
    <div className={`${styles.cardContainer} ${styles.receiptCardContainer}`}>
      <div className={`bg-[var(--receipt-background-color)] p-3`}>
        <h2 className="" style={{ fontSize: 22 }}>
          商品名:<span className="font-bold">{ticket.menuTitle}</span>
        </h2>
      </div>
      <div className="bg-menuBackground p-2 flex flex-col gap-1">
        <InfoWrapper>
          <InfoTitle>商品価格:</InfoTitle>
          <Info right>{ticket.menuPrice}円</Info>
        </InfoWrapper>
        <InfoWrapper>
          <InfoTitle>オプション:</InfoTitle>
          <Info>
            <ul>
              {ticket.options
                .filter((option) => !option.isDefault)
                .map((option) => (
                  <li key={option.choiceHandle}>
                    <InfoWrapper>
                      <Info>{option.choiceName}:</Info>{" "}
                      <Info>{option.priceDiff}円</Info>{" "}
                    </InfoWrapper>
                  </li>
                ))}
            </ul>
          </Info>
        </InfoWrapper>
        <InfoWrapper>
          <InfoTitle>合計金額:</InfoTitle>
          <Info>{ticket.totalPrice}円</Info>
        </InfoWrapper>
        <InfoWrapper>
          <InfoTitle>食券ステータス:</InfoTitle>
          <Info>
            <span
              style={{
                color: tickeStatusColorBind[ticket.status],
              }}
            >
              {localizedTicketStatus[ticket.status]}
            </span>
          </Info>
        </InfoWrapper>
        <InfoWrapper>
          <InfoTitle>購入日時:</InfoTitle>
          <Info>{`${getDate(ticket.createdAt, "month")} ${getTime(
            ticket.createdAt
          )}`}</Info>
        </InfoWrapper>
        {ticket.sameReceiptTickets.length >= 2 ? (
          <InfoWrapper>
            <InfoTitle>同一レシートの食券:</InfoTitle>
            <Info>
              <ul>
                {ticket.sameReceiptTickets.map((sameTicket) => (
                  <li key={sameTicket.id}>
                    <InfoWrapper>
                      <Info>
                        {sameTicket.id === ticket.id ? (
                          sameTicket.menuTitle + ":"
                        ) : (
                          <>
                            <Link
                              className="underline text-[black]"
                              href={`/history/detail/${sameTicket.id}`}
                            >
                              {sameTicket.menuTitle}
                            </Link>
                            :
                          </>
                        )}
                      </Info>
                      <Info>
                        <span
                          style={{
                            color: tickeStatusColorBind[sameTicket.status],
                          }}
                        >
                          {localizedTicketStatus[sameTicket.status]}
                        </span>
                      </Info>
                    </InfoWrapper>
                  </li>
                ))}
              </ul>
            </Info>
          </InfoWrapper>
        ) : null}
        <InfoWrapper>
          <InfoTitle>決済ID:</InfoTitle>
          <Info>
            <span className="text-[12px]">{ticket.paymentId}</span>
          </Info>
        </InfoWrapper>
        <InfoWrapper>
          <InfoTitle>食券ID:</InfoTitle>
          <Info>
            <span className="text-[12px]">{ticket.id}</span>
          </Info>
        </InfoWrapper>
      </div>
    </div>
  );
};
