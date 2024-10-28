"use client";

import { MenuOption } from "@/common/types/menu";
import styles from "@/common/styles/app/menu/menu.module.scss";
import React, { useState } from "react";
import {
  CafeteriaOptionCard,
  CafeteriaOptionCardPlus,
} from "@/components/cards/optionCard";

/**
 * 食堂側で、メニューを編集する画面
 * 食券を選択し、カートに入れる
 */
export const CafeteriaOptionListPageComponent: React.FC<{
  options: MenuOption[];
}> = ({ options: defaultOptions }) => {
  const [options, setOptions] = useState<MenuOption[]>(defaultOptions);
  return (
    <div className={styles.menu}>
      <div className={styles.menuContainerWrapper}>
        <div className={styles.menuContainer}>
          {options.map((option, idx) => (
            <CafeteriaOptionCard
              key={option.id}
              option={option}
              options={options}
              setOptions={setOptions}
            />
          ))}
          <CafeteriaOptionCardPlus options={options} setOptions={setOptions} />
        </div>
      </div>
    </div>
  );
};

export default CafeteriaOptionListPageComponent;
