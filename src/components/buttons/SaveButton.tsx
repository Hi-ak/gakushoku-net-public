import styles from "@/common/styles/components/buttons/saveButton.module.scss";
import Icon from "@mdi/react";
import { mdiDownload } from "@mdi/js";

export const SaveButton: React.FC<{
  onClick: () => void;
  text: string;
}> = ({ onClick, text = "ダウンロード" }) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {text}
    </button>
  );
};
