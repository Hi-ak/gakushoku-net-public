"use client";
import React from "react";
import styles from "@/common/styles/components/modals/modalUi.module.scss";

export const ModalButton: React.FC<{
  onClick?: () => void;
  label?: string;
  className?: string;
}> = ({ onClick, label = "選択", className: customClassName = "" }) => {
  return (
    <div
      onClick={onClick}
      className={[styles.modalButton, customClassName].join(" ")}
    >
      <div className={styles.text}>{label}</div>
    </div>
  );
};
