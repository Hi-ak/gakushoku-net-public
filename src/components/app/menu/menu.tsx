"use client";

import { CartTicket } from "@/common/types/cart";
import { Menu, MenuCategory } from "@/common/types/menu";
import { MenuCard } from "../../cards/menuCard";
import styles from "@/common/styles/app/menu/menu.module.scss";
import { CancelButton, CartButton } from "@/components/menu/menuButtons";
import { SmallAlert } from "@/components/modals/alert";
import React, { useEffect } from "react";

/**
 * メニューページのメニューとなるページ
 * 食券を選択し、カートに入れる
 */
export const MenuComponent: React.FC<{
  menus: MenuCategory[];
  cart: CartTicket[];
  setCart: React.Dispatch<React.SetStateAction<CartTicket[]>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  isPurchaseRestricted: boolean; //購入枚数の上限を超えていたら購入させない
  isOperating: boolean;
}> = ({ menus, setPage, cart, setCart, isPurchaseRestricted, isOperating }) => {
  const [currCategory, setCurrCategory] = React.useState<string>(
    menus[0].categoryHandle
  );
  const [alertActive, setAlertActive] = React.useState<boolean>(false);
  return (
    <div className={styles.menu}>
      <div className={styles.categoryContainer}>
        {menus.map((category, idx) => (
          <React.Fragment key={category.categoryHandle}>
            {idx !== 0 && <div className={styles.bar}></div>}
            <input
              type="radio"
              name="category"
              id={`category-${category.categoryHandle}`}
              readOnly
              checked={currCategory === category.categoryHandle}
              onClick={() => {
                setCurrCategory(category.categoryHandle);
              }}
            />
            <div className={styles.category}>
              <label htmlFor={`category-${category.categoryHandle}`}>
                {category.categoryName}
              </label>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.menuContainerWrapper}>
        <div className={styles.menuContainer}>
          {menus
            .find((category) => category.categoryHandle === currCategory)
            .menus.map((menu) => (
              <MenuCard
                key={menu.id + cart.length}
                menu={menu}
                setCart={setCart}
              />
            ))}
        </div>
      </div>
      <div className={styles.bottom}>
        {!isOperating ? (
          <div className={styles.restrictionText}>
            <h3>営業時間外です</h3>
          </div>
        ) : isPurchaseRestricted ? (
          <div className={styles.restrictionText}>
            <h3>1日の購入枚数の上限を超えました</h3>
          </div>
        ) : (
          <>
            <CancelButton
              onClick={() => {
                setAlertActive(true);
              }}
            />
            <CartButton
              onClick={() => {
                setPage("cart");
              }}
              itemNum={cart.length}
            />
          </>
        )}
      </div>
      <SmallAlert active={alertActive} setActive={setAlertActive}>
        <div className={styles.alertContainer}>
          <div className={styles.alertTitle}>カートの中身を破棄しますか？</div>
          <div className={styles.alertButtons}>
            <div
              className={[styles.button, styles.cancel].join(" ")}
              onClick={() => {
                setAlertActive(false);
              }}
            >
              破棄しない
            </div>
            <div
              className={[styles.button, styles.confirm].join(" ")}
              onClick={() => {
                setCart([]);
                setCurrCategory(menus[0].categoryHandle);
                setAlertActive(false);
              }}
            >
              破棄する
            </div>
          </div>
        </div>
      </SmallAlert>
    </div>
  );
};
