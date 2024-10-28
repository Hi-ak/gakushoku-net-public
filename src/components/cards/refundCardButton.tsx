// 本来はcardButtonのcustomClassとして実装したいが、stylesを
// menuCardの部分とcardButtonの入る.buttonContainer以降で別のcssファイルに分けた方がいいかも
// とりあえずはrefundCard.module.scssでbuttonのスタイルを指定する
// あとで、menuCard.module.scssとrefundCard.module.scssのボタン部分のスタイルのマージが必要

"use client";
import React from "react";
import styles from "@/common/styles/components/cards/refundCard.module.scss";
import { TextWithLoadingIcon } from "../loading/textWithLoadingIcon";

export const RefundCardButton: React.FC<{
  onClick?: () => void;
  children?: React.ReactNode;
  label?: string;
  className?: string;
}> = ({ onClick, label = "選択", className: customClassName, children }) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.buttonContainer} ${styles[customClassName]}`}
    >
      <div className={styles.text}>{children || label}</div>
    </div>
  );
};
