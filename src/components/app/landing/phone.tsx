import styles from "@/common/styles/app/client/landing.module.scss";
import Image, { StaticImageData } from "next/image";
import phoneFrame from "@/phoneScreens/phone_frame.png";

export const PhoneComponent: React.FC<{ screenImgPath: StaticImageData }> = ({
  screenImgPath,
}) => {
  return (
    <li className={styles.phone}>
      <Image alt="" className={styles.frame} src={phoneFrame} />
      <Image alt="" className={styles.screen} src={screenImgPath} />
    </li>
  );
};
