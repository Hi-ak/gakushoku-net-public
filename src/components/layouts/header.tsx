"use client";
import React from "react";
import styles from "@/common/styles/components/layouts/header.module.scss";
import { Drawer } from "./drawer";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

type Props = {
  titleText: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  font?: string;
};

export const Header: React.FC<Props> = ({
  titleText,
  setOpen,
  open,
  font = "",
}) => {
  return (
    <header className={[styles.headerContainer, font].join(" ")}>
      <div className={styles.header}>
        <div className={styles.title}>
          <a href="/menu">{titleText}</a> {/* 要変更  */}
        </div>
        <div className={styles.buttons}>
          <div
            className={styles.menu}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Icon path={mdiMenu} size={2} />
          </div>
        </div>
      </div>
    </header>
  );
};
