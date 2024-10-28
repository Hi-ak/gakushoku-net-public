import styles from "@/common/styles/app/menu/menu.module.scss";
import { mdiCartArrowRight } from "@mdi/js";
import Icon from "@mdi/react";

export const CancelButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLDivElement>;
}> = ({ onClick }) => {
  return (
    <div onClick={onClick} className={[styles.button, styles.cancel].join(" ")}>
      キャンセル
    </div>
  );
};

export const CartButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLDivElement>;
  itemNum: number;
}> = ({ onClick, itemNum }) => {
  return (
    <div onClick={onClick} className={[styles.button, styles.cart].join(" ")}>
      <span>
        カート
        <Icon path={mdiCartArrowRight} className={styles.cartIcon} />
      </span>
      {itemNum > 0 && <span className={styles.itemNum}>{itemNum}</span>}
    </div>
  );
};
