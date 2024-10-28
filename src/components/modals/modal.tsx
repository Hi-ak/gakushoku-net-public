"use client";
import React, { ReactNode } from "react";
import styles from "@/common/styles/components/modals/modal.module.scss";

export const ModalShadow: React.FC<{
  noShadowClose?: boolean;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}> = ({ active, setActive, className: customClassName, noShadowClose }) => {
  return (
    <div
      className={[
        styles.shadow,
        active ? styles.active : "",
        noShadowClose ? styles.noShadowClose : "",
        customClassName,
      ].join(" ")}
      onClick={
        noShadowClose
          ? null
          : () => {
              setActive(false);
            }
      }
    ></div>
  );
};

/**
 * 下から出てくるモーダルを表示する。
 * 表示されているときは、背景を暗くする。
 */
export const Modal: React.FC<{
  children?: ReactNode;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  alert?: boolean;
  noShadowClose?: boolean;
}> = ({
  children,
  active,
  setActive,
  className: customClassName,
  alert = false,
  noShadowClose = false,
}) => {
  return (
    <React.Fragment>
      <ModalShadow
        noShadowClose={noShadowClose}
        active={active}
        setActive={setActive}
      />
      {/* 暫定的に.laptopクラスを追加 */}
      <div
        className={[
          alert ? styles.alert : styles.modal,
          active ? styles.active : "",
          customClassName,
        ].join(" ")}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

/**
 * 下から出てくるモーダルを表示する。
 * 表示されているときは、背景を暗くする。
 * スマートフォン用
 */
export const SmallModal: React.FC<{
  children?: ReactNode;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ children, active, setActive }) => {
  return (
    <Modal active={active} setActive={setActive} className={styles.small}>
      {children}
    </Modal>
  );
};
