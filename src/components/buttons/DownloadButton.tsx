import styles from "@/common/styles/components/buttons/downloadButton.module.scss";
import Icon from "@mdi/react";
import { mdiDownload } from "@mdi/js";
import { LoadingIcon } from "../loading/loadingIcon";

export const DownloadButton: React.FC<{
  onClick: () => {};
  text: string;
  isDownloading: boolean;
}> = ({ onClick, text = "ダウンロード", isDownloading }) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {isDownloading ? (
        <LoadingIcon className="brown" />
      ) : (
        <>
          <Icon path={mdiDownload} size={2} color="#4461c8" />
          {text}
        </>
      )}
    </button>
  );
};
