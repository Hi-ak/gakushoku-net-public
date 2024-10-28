import { MenuCategory } from "@/common/types/menu";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";

import styles from "@/common/styles/app/menu/menu.module.scss";

import { CafeteriaMenuIndexCard } from "@/components/cards/cafeteriaMenuIndexCard";

import React, { useEffect, useId, useState } from "react";
import { SortedMenuProp } from "@/common/types/menu";

export const CategoryIndexControlComponent: React.FC<{
  categoryId: string;
  categoryName: string;
  indexInfo: { [key: string]: SortedMenuProp[] };
  setIndexInfo: React.Dispatch<
    React.SetStateAction<{ [key: string]: SortedMenuProp[] }>
  >;
}> = ({ categoryId, categoryName, indexInfo, setIndexInfo }) => {
  const [items, setItems] = useState<SortedMenuProp[]>(indexInfo[categoryId]);

  const id = useId();
  return (
    <div className={styles.indexControl}>
      <h3 className={styles.categoryName}>{categoryName}</h3>
      <DndContext
        onDragMove={(event) => {
          const { active, over } = event;
          if (over == null) {
            return;
          }
          if (active.id !== over.id) {
            setItems((items) => {
              const oldIndex = items.findIndex((item) => item.id === active.id);
              const newIndex = items.findIndex((item) => item.id === over.id);
              return arrayMove(items, oldIndex, newIndex);
            });
          }
        }}
        onDragEnd={(event) => {
          const updatedIndexInfo = { ...indexInfo };
          updatedIndexInfo[categoryId] = items;
          setIndexInfo(updatedIndexInfo);
        }}
        id={id}
      >
        <SortableContext items={items}>
          {items.map((item, idx) => {
            return (
              <CafeteriaMenuIndexCard key={idx} id={item.id} name={item.name} />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CategoryIndexControlComponent;
