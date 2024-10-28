"use client";
import { Drawer } from "@/components/layouts/drawer";
import { Header } from "@/components/layouts/header";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/common/styles/app/client/layout.module.scss";
import { Kaisei_Opti } from "next/font/google";

const decol = Kaisei_Opti({ subsets: ["latin"], weight: "400" });

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
      <Header
        titleText="開発者画面"
        setOpen={setOpen}
        open={open}
        font={decol.className}
      />
      <Drawer ref={drawerRef} setOpen={setOpen} font={decol.className} />
      <div
        id="shadow"
        ref={shadowRef}
        onClick={() => {
          setOpen(false);
        }}
        className={styles.shadow}
      ></div>
      <main className={[styles.main, decol.className].join(" ")}>
        {children}
      </main>
    </React.Fragment>
  );
};

export default ClientLayout;
