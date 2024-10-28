"use client";
import React, { useEffect, useState } from "react";
import styles from "@/common/styles/components/cards/menuCard.module.scss";
import { Ticket } from "@/common/types/ticket";
import { CardToggleButton } from "./cardToggleButton";
import Image from "next/image";
import shokkenImg from "../../../public/shokken.png";

/**
 * 購入済みチケットで表示する食券のコンポーネント
 */
export const TicketCard: React.FC<{
  ticket: Ticket;
  selectedTickets: Ticket[];
  setSelectedTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  disabled: boolean;
}> = ({ ticket, selectedTickets, setSelectedTickets, disabled = false }) => {
  //合計金額を計算
  const totalPrice =
    ticket.menuRelation.price +
    ticket.options.reduce(
      (prev, curr) => prev + curr.choiceRelation.priceDiff,
      0
    );

  return (
    <div className={`${styles.cardContainer} ${styles.cardContainer__ticket}`}>
      <Image
        priority
        fill
        alt=""
        className={styles.ticketBackground}
        src={shokkenImg}
      />
      <div className={styles.titleAndPrice}>
        <h2 className={styles.title}>{ticket.menuRelation.title}</h2>
        <div className={styles.price}>{totalPrice}円</div>
      </div>
      <ul className={styles.contents}>
        {ticket.menuRelation.contents.map((content) => (
          <li key={content}>{content}</li>
        ))}
        {ticket.options
          .filter((option) => !option.choiceRelation.isDefault)
          .map((option) => (
            <li key={ticket.id + option.id}>
              {option.choiceRelation.choiceName}&nbsp;
              {Math.sign(option.choiceRelation.priceDiff) ? "+" : "-"}
              {option.choiceRelation.priceDiff}円
            </li>
          ))}
      </ul>
      {disabled ? null : (
        <CardToggleButton
          onSelected={() => {
            setSelectedTickets([...selectedTickets, ticket]);
          }}
          onUnselected={() => {
            setSelectedTickets(
              selectedTickets.filter((item) => {
                return item.id != ticket.id;
              })
            );
          }}
          isSelectedByDefault={false}
          selectedText="取消"
          unselectedText="選択"
        />
      )}
    </div>
  );
};
