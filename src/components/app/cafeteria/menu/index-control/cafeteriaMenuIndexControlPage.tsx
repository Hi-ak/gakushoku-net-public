"use client";
import { Menu, MenuCategory } from "@/common/types/menu";
//import { MenuCard } from "../../../../cards/menuCard";
import styles from "@/common/styles/app/menu/menu.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CategoryIndexControlComponent from "./categoryIndexControl";
import { SaveButton } from "@/components/buttons/SaveButton";
import { jsonFetch } from "@/common/utils/customFetch";
import { SortedMenuProp } from "@/common/types/menu";
import { ApiResponse } from "@/common/types/apiResponse";

export const CafeteriaMenuIndexControlPageComponent: React.FC<{
  categories: MenuCategory[];
}> = ({ categories }) => {
  const router = useRouter();

  useEffect(() => {});

  const DefaultIndexInfo: { [key: string]: SortedMenuProp[] } = {};
  for (const category of categories) {
    DefaultIndexInfo[category.id as string] = category.menus.map((menu) => {
      const item = new SortedMenuProp();
      item.id = menu.id as string;
      item.name = menu.title;
      return item;
    });
  }

  const [indexInfo, setIndexInfo] = useState<{
    [key: string]: SortedMenuProp[];
  }>(DefaultIndexInfo);

  const onSaveButtonClicked = async () => {
    const response = await jsonFetch(
      "/api/cafeteria/menu/update-index",
      "PUT",
      {
        indexInfo,
      }
    );

    const result = (await response.json()) as ApiResponse;

    if (result.success) {
      router.push("/cafeteria/menu/list");
    }
  };

  return (
    <div className={styles.menu}>
      <div className={styles.indexControlContainer}>
        {categories.map((category) => (
          <CategoryIndexControlComponent
            key={category.id}
            categoryId={category.id as string}
            categoryName={category.categoryName}
            indexInfo={indexInfo}
            setIndexInfo={setIndexInfo}
          />
        ))}
      </div>
      <div className={styles.saveButtonContainer}>
        <SaveButton onClick={onSaveButtonClicked} text="順番を保存する" />
      </div>
    </div>
  );
};

export default CafeteriaMenuIndexControlPageComponent;
