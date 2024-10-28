"use client";
import { Menu, MenuCategory } from "@/common/types/menu";
import { MenuComponent } from "./menu";
import { Slide, Slides } from "@/components/screen/slide";
import React, { useEffect, useRef, useState } from "react";
import { CartComponent } from "./cart";
import { CartTicket, ClientCartTicket } from "@/common/types/cart";
import { User } from "@/common/types/user";

/**
 * 表示用のメニューページ
 * メニューページの本体と言っても過言ではない
 */
const MenuPageComponent: React.FC<{
  menus: MenuCategory[];
  user: User;
  isPurchaseRestricted: boolean;
  isOperating: boolean; //食堂が営業中か
}> = ({ menus, user, isPurchaseRestricted, isOperating }) => {
  // ページ遷移用の state
  // この state を変更することによってページを遷移する。
  const [currPage, setCurrPage] = useState<string>("menu");
  const [cart, setCart] = React.useState<ClientCartTicket[]>([]);
  React.createElement("div", "a");
  return (
    <>
      <Slides currPage={currPage} setCurrPage={setCurrPage} defaultPage="menu">
        <Slide pageId="menu">
          <MenuComponent
            menus={menus}
            setPage={setCurrPage}
            cart={cart}
            setCart={setCart}
            isPurchaseRestricted={isPurchaseRestricted}
            isOperating={isOperating}
          />
        </Slide>
        {isOperating && !isPurchaseRestricted ? (
          <Slide pageId="cart">
            <CartComponent
              cafeteriaId={user.cafeteriaId}
              userId={user.id}
              setPage={setCurrPage}
              cart={cart}
              setCart={setCart}
            />
          </Slide>
        ) : null}
      </Slides>
    </>
  );
};

export default MenuPageComponent;
