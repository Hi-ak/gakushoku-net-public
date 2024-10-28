import styles from "@/common/styles/app/menu/menu.module.scss";
import { mdiCartArrowRight } from "@mdi/js";
import Icon from "@mdi/react";

export const OrderButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLDivElement>;
  itemNum: number;
  className?: string;
}> = ({ onClick, itemNum, className: customClassName }) => {
  return (
    <div
      onClick={onClick}
      className={[styles.button, styles.cart, customClassName].join(" ")}
    >
      <span>
        注文する
        <Icon path={mdiCartArrowRight} className={styles.cartIcon} />
      </span>
      {itemNum > 0 && <span className={styles.itemNum}>{itemNum}</span>}
    </div>
  );
};
