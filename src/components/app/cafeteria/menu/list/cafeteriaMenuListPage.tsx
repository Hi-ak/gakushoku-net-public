"use client";

import { CartTicket } from "@/common/types/cart";
import { Menu, MenuCategory } from "@/common/types/menu";
//import { MenuCard } from "../../../../cards/menuCard";
import {
  CafeteriaMenuCard,
  CafeteriaMenuCardPlus,
} from "@/components/cards/cafeteriaMenuCard";
import styles from "@/common/styles/app/menu/menu.module.scss";
import { CancelButton, CartButton } from "@/components/menu/menuButtons";
import { Alert } from "@/components/modals/alert";
import React, { useEffect, useState } from "react";
import { MenuOption } from "@prisma/client";

export const CafeteriaMenuListPageComponent: React.FC<{
  menus: MenuCategory[];
  options: MenuOption[];
}> = ({ menus: defaultMenus, options }) => {
  const [menus, setMenus] = useState<MenuCategory[]>(defaultMenus);
  const [currCategory, setCurrCategory] = useState<string>(
    defaultMenus[0].categoryHandle
  );
  const [added, setAdded] = useState<string>("");
  return (
    <div className={styles.menu}>
      <div className={styles.categoryContainer}>
        {defaultMenus.map((category, idx) => (
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
            .menus.map((menu, idx) => (
              <CafeteriaMenuCard
                key={menu.id}
                idx={idx}
                menu={menu}
                setMenus={setMenus}
                options={options}
                defaultModalActive={added === menu.id}
              />
            ))}
          <CafeteriaMenuCardPlus
            category={currCategory}
            setMenus={setMenus}
            cafeteriaId={menus[0].menus[0].cafeteriaId}
            setAdded={setAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default CafeteriaMenuListPageComponent;
