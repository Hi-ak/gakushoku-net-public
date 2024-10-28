import styles from "@/common/styles/components/inputs/input.module.scss";
import { MouseEventHandler } from "react";

export const RadioButton: React.FC<{
  name: string;
  id?: string;
  defaultChecked?: boolean;
  className?: string;
  value: string;
  onClick?: MouseEventHandler<HTMLInputElement>;
}> = ({
  name,
  id,
  defaultChecked = false,
  className: customClassName,
  value,
  onClick,
}) => {
  const thisId = id || `${name}-${value}`;
  return (
    <div className={[styles.radioButton, customClassName].join(" ")}>
      <input
        className={styles.radioButtonInput}
        name={name}
        id={thisId}
        value={value}
        type="radio"
        defaultChecked={defaultChecked}
        onClick={onClick}
      />
      <label htmlFor={thisId} className={styles.radioButtonDisplay}></label>
    </div>
  );
};
