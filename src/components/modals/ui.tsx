import { ReactNode } from "react";
import styles from "@/common/styles/components/modals/modalUi.module.scss";

export const NormalAlertContainer: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return <div className={styles.alert}>{children}</div>;
};
