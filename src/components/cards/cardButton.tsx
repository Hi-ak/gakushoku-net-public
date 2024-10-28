"use client";
import React from "react";
import styles from "@/common/styles/components/cards/menuCard.module.scss";
import { TextWithLoadingIcon } from "../loading/textWithLoadingIcon";

export const CardButton: React.FC<{
  onClick?: () => void;
  children?: React.ReactNode;
  label?: string;
  className?: string;
}> = ({ onClick, label = "選択", className: customClassName, children }) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.buttonContainer} ${customClassName}`}
    >
      <div className={styles.text}>{children || label}</div>
    </div>
  );
};
