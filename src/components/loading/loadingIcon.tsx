import styles from "@/common/styles/components/loading/loadingIcon.module.scss";

export const LoadingIcon: React.FC<{
  className?: string;
}> = ({ className: customClassName }) => {
  return (
    <div className={`${styles.loadingContainer} ${styles[customClassName]}`}>
      <div className={styles.loading}></div>
    </div>
  );
};
