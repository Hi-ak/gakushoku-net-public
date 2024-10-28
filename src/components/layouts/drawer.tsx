"use client";
import React, { forwardRef, RefObject, useEffect } from "react";
import styles from "@/common/styles/components/layouts/header.module.scss";
import {
  adminDrawerContents,
  devDrawerContents,
  drawerContents,
} from "@/common/var/drawer";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  getSession,
  SessionProvider,
  signOut,
  useSession,
} from "next-auth/react";
import { authorize } from "@/common/utils/authorize";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  font?: string;
};

export const Drawer = forwardRef<HTMLDivElement, Props>(function InputField(
  { setOpen, className, font = "" },
  ref: RefObject<HTMLDivElement>
) {
  return (
    <SessionProvider>
      <DrawerContent
        setOpen={setOpen}
        className={className}
        ref={ref}
        font={font}
      />
    </SessionProvider>
  );
});

export const DrawerContent = forwardRef<HTMLDivElement, Props>(
  function InputField(
    { setOpen, className: customClassName, font },
    ref: RefObject<HTMLDivElement>
  ) {
    const path = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isDev, setIsDev] = React.useState(false);
    useEffect(() => {
      if (status === "authenticated" && session) {
        setIsAdmin(authorize("ADMIN", session));
        setIsDev(authorize("DEV", session));
      }
    }, [session, status]);
    return (
      <div
        className={[styles.drawer, customClassName, font].join(" ")}
        ref={ref}
      >
        {/* <div className="text-sm">
        ユーザーID:
        <br />
        {Cookies.get("tempUserId")}
      </div> */}
        <div className={styles.drawerContents}>
          {(
            [
              ...drawerContents,
              ,
              ...(isDev
                ? [
                    { type: "divider", name: "devDivider", url: "" },
                    ...devDrawerContents,
                  ]
                : []),

              ...(isAdmin
                ? [
                    { type: "divider", name: "adminDivider", url: "" },
                    ...adminDrawerContents,
                  ]
                : []),
              { type: "logout", name: "ログアウト", url: "" },
            ] as { type?: string; name: string; url: string }[]
          ).map((content) => {
            if (content.type === "divider") {
              return (
                <div key={content.name} className="h-1 w-full bg-primary"></div>
              );
            } else if (content.type === "logout") {
              return (
                <Link
                  href={"/api/auth/signout"}
                  key={content.name}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  <div className={styles.content}>{content.name}</div>
                </Link>
              );
            }
            const currentRegexp = new RegExp(`^${content.url}[^/]*$`);
            const isCurrent = currentRegexp.test(path);
            // console.log(isCurrent, content.url, path);
            return (
              <Link
                key={content.url}
                href={content.url}
                className={isCurrent ? styles.current : ""}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(content.url);
                  router.refresh();
                  setOpen(false);
                }}
              >
                <div className={styles.content}>{content.name}</div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
);
