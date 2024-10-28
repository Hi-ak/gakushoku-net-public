import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "@/common/styles/components/cards/cafeteriaMenuIndexCard.module.scss";

import { Menu, MenuCategory } from "@/common/types/menu";

export const CafeteriaMenuIndexCard: React.FC<{
  id: string;
  name: string;
}> = ({ id, name }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={styles.cardContainer}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
      }}
    >
      <div className={styles.card}>
        <h3 className={styles.name}>{name}</h3>
      </div>
    </div>
  );
};
