"use client";
import { Drawer } from "@/components/layouts/drawer";
import { Header } from "@/components/layouts/header";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/common/styles/app/client/layout.module.scss";

// クライアント専用のレイアウト
// ヘッダーとドロワーが共通
const ClientLayout = ({ children }) => {
  const shadowRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      shadowRef.current?.classList.add(styles.active);
      drawerRef.current?.classList.add(styles.open);
    } else {
      shadowRef.current?.classList.remove(styles.active);
      drawerRef.current?.classList.remove(styles.open);
    }
  }, [open]);
  return (
    <React.Fragment>
      <Header titleText="食堂" setOpen={setOpen} open={open} />
      <Drawer ref={drawerRef} setOpen={setOpen} />
      <div
        id="shadow"
        ref={shadowRef}
        onClick={() => {
          setOpen(false);
        }}
        className={styles.shadow}
      ></div>
      <main className={styles.main}>{children}</main>
    </React.Fragment>
  );
};

export default ClientLayout;
