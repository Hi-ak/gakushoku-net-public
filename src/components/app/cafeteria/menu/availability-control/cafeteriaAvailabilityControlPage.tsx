"use client";
import { Menu, MenuCategory } from "@/common/types/menu";
import styles from "@/common/styles/app/menu/menu.module.scss";
import React, { useEffect, useState } from "react";
import { MenuOption, ServiceStatus } from "@prisma/client";
import { AvailabilitySwitchCard } from "@/components/cards/availabilitySwitchCard";

export const CafeteriaAvailabilityControlPageComponent: React.FC<{
  menuSales: { [id: string]: number };
  menus: Menu[];
}> = ({ menus, menuSales }) => {
  return (
    <div className={styles.menu}>
      <div className={styles.menuContainerWrapper}>
        <div
          className={`${styles.menuContainer} ${styles.menuContainer__availabilitySwitch}`}
        >
          {menus.map((menu, idx) => {
            return (
              <AvailabilitySwitchCard
                menu={menu}
                sales={menuSales[menu.id]}
                isAvailable={menu.serviceStatus === ServiceStatus.AVAILABLE}
                key={idx}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CafeteriaAvailabilityControlPageComponent;
