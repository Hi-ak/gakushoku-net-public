import { NextPage } from "next";
import React from "react";
import phone1 from "@/phoneScreens/1.png";
import phone2 from "@/phoneScreens/2.png";
import phone3 from "@/phoneScreens/3.png";
import phone4 from "@/phoneScreens/4.png";
import phone5 from "@/phoneScreens/5.png";

import { PhoneComponent } from "@/components/app/landing/phone";

import styles from "@/common/styles/app/client/landing.module.scss";
import Image from "next/image";
import icon from "@/icon/sample3.png";

const LandingPage: NextPage = async () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.background}>
        <ul className={styles.phoneRow}>
          <PhoneComponent screenImgPath={phone1} />
          <PhoneComponent screenImgPath={phone2} />
          <PhoneComponent screenImgPath={phone3} />
          <PhoneComponent screenImgPath={phone4} />
        </ul>
        <ul className={styles.phoneRow}>
          <PhoneComponent screenImgPath={phone3} />
          <PhoneComponent screenImgPath={phone4} />
          <PhoneComponent screenImgPath={phone1} />
          <PhoneComponent screenImgPath={phone2} />
        </ul>
        <ul className={styles.phoneRow}>
          <PhoneComponent screenImgPath={phone5} />
          <PhoneComponent screenImgPath={phone1} />
          <PhoneComponent screenImgPath={phone2} />
          <PhoneComponent screenImgPath={phone3} />
        </ul>
        <ul className={styles.phoneRow}>
          <PhoneComponent screenImgPath={phone2} />
          <PhoneComponent screenImgPath={phone3} />
          <PhoneComponent screenImgPath={phone4} />
          <PhoneComponent screenImgPath={phone5} />
        </ul>
        <ul className={styles.phoneRow}>
          <PhoneComponent screenImgPath={phone4} />
          <PhoneComponent screenImgPath={phone5} />
          <PhoneComponent screenImgPath={phone1} />
          <PhoneComponent screenImgPath={phone2} />
        </ul>
      </div>
      <div className={styles.page}>
        {/*
        <div className={`${styles.phoneContainer} ${styles.left}`}>
          <img src="992_color.png" />
        </div>
        */}
        <div className={styles.centerContent}>
          <div className={styles.logoContainer}>
            <div className={styles.iconContainer}>
              <div className={[styles.icon, "relative"].join(" ")}>
                <Image fill alt="" src={icon} />
              </div>
            </div>
            <div className={styles.logo}>
              <h3 className={styles.subtitle}>食券モバイル注文アプリ</h3>
              <h2 className={styles.mainLogo}>学食ネット</h2>
            </div>
          </div>
          <h3 className={styles.motto}>
            <span className={styles.accent1}>学生食堂</span>を
            <br />
            <span className={styles.accent2}>生徒</span>にとっても
            <br />
            <span className={styles.accent3}>調理師</span>の方にとっても
            <br />
            もっと<span className={styles.accent4}>便利</span>に
          </h3>
          <br />
          <br />
          <div className={styles.formContainer}>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfXRcbB4adpcBt7ksY9GUguNtn4buWMcyV5svRdaDfswnDQCA/viewform?embedded=true"
              className={styles.googleForm}
            >
              読み込んでいます…
            </iframe>
          </div>
        </div>
        {/*
        <div className={`${styles.phoneContainer} ${styles.right}`}>
          <img src="992_color.png" />
        </div>
        */}
      </div>
    </div>
  );
};

export default LandingPage;
