"use client";
import React, { useEffect } from "react";
import styles from "@/common/styles/components/cards/menuCard.module.scss";

//カード上で、選択/非選択を切り替えるボタン。
export const CardToggleButton: React.FC<{
  onSelected: () => void;
  onUnselected: () => void;
  isSelectedByDefault: boolean; //初期状態で選択されているか
  selectedText: string; //選択時に表示する文言: 取消
  unselectedText: string; //選択されていない時に表示する文言: 選択
}> = ({
  onSelected,
  onUnselected,
  isSelectedByDefault,
  selectedText,
  unselectedText,
}) => {
  const [isSelected, setIsSelected] =
    React.useState<boolean>(isSelectedByDefault);

  return isSelected ? (
    <div
      onClick={() => {
        onUnselected();
        setIsSelected(false);
      }}
      className={`${styles.buttonContainer} ${styles.buttonContainer__selected} `}
    >
      <div className={styles.text}>{selectedText}</div>
    </div>
  ) : (
    <div
      onClick={() => {
        onSelected();
        setIsSelected(true);
      }}
      className={`${styles.buttonContainer} ${styles.buttonContainer__unselected} `}
    >
      <div className={styles.text}>{unselectedText}</div>
    </div>
  );
};
