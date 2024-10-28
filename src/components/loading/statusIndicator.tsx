import styles from "@/common/styles/components/loading/statusIndicator.module.scss";
import { LoadingIcon } from "./loadingIcon";
import { useEffect } from "react";

export const StatusIndicator: React.FC<{
  status: StatusValue;
  message: string;
}> = ({ status, message }) => {
  return (
    //本当はclassNameで変えたかったがなんかうまくい
    <div
      className={`${styles.indicator} ${
        status.valueOf() == StatusValue.Ok.valueOf()
          ? styles.ok
          : status.valueOf() == StatusValue.Loading.valueOf()
          ? styles.loading
          : status.valueOf() == StatusValue.Error.valueOf()
          ? styles.error
          : ""
      }`}
      style={{}}
    >
      <h3 className={styles.message}>{message}</h3>
      {status.valueOf() == StatusValue.Loading.valueOf() ? (
        <LoadingIcon className="brown" />
      ) : (
        <></>
      )}
    </div>
  );
};

export enum StatusValue {
  Ok,
  Loading,
  Error,
}
