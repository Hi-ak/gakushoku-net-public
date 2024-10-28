"use client";
import React, { ReactNode } from "react";
import styles from "@/common/styles/components/modals/modal.module.scss";
import { Modal } from "./modal";

/**
 * 上から出てくるアラートを表示する。
 * 表示されているときは、背景を暗くする。
 */
export const SmallAlert: React.FC<{
  children?: ReactNode;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ children, active, setActive }) => {
  return (
    <Alert active={active} setActive={setActive} className={styles.smallAlert}>
      {children}
    </Alert>
  );
};

/**
 * 上から出てくるアラートを表示する。
 * 表示されているときは、背景を暗くする。
 */
export const Alert: React.FC<{
  children?: ReactNode;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}> = ({ children, active, setActive, className: customClassName }) => {
  return (
    <Modal
      active={active}
      setActive={setActive}
      className={[styles.alert, customClassName].join(" ")}
      alert
    >
      {children}
    </Modal>
  );
};

export const ConfirmAlert: React.FC<{
  children?: ReactNode;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}> = ({ children, active, setActive, onConfirm }) => {
  return (
    <React.Fragment>
      <Alert active={active} setActive={setActive}>
        {children}
        <div className={styles.buttonContainer}>
          <div
            className={styles.button}
            onClick={() => {
              setActive(false);
            }}
          >
            キャンセル
          </div>
          <div className={styles.button} onClick={onConfirm}>
            確認
          </div>
        </div>
      </Alert>
    </React.Fragment>
  );
};
