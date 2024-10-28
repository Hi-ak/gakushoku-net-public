import styles from "@/common/styles/components/inputs/input.module.scss";
import { MouseEventHandler } from "react";

export const CheckBox: React.FC<{
  name: string;
  id?: string;
  defaultChecked?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLInputElement>;
}> = ({
  name,
  id,
  defaultChecked = false,
  className: customClassName,
  onClick,
}) => {
  const thisId = id || `${name}`;
  return (
    <div className={[styles.checkBox, customClassName].join(" ")}>
      <input
        className={styles.checkBoxInput}
        name={name}
        id={thisId}
        type="checkbox"
        defaultChecked={defaultChecked}
        onClick={onClick}
      />
      <label htmlFor={thisId} className={styles.checkBoxDisplay}></label>
    </div>
  );
};
