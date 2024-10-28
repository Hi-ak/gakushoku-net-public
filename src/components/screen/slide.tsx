"use client";
import styles from "@/common/styles/components/screen/slide.module.scss";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef } from "react";

export const Slides: React.FC<{
  children: React.ReactElement<SlideProps>[];
  currPage: string;
  setCurrPage: React.Dispatch<React.SetStateAction<string>>;
  defaultPage?: string;
}> = ({ children, currPage, setCurrPage, defaultPage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const changePage = (currPage, router) => {
    router.push(`#${currPage}`);
    const container = containerRef.current;
    const targetPage = document.getElementById(`page-${currPage}`);
    if (container && targetPage) {
      container.style.transform = `translateX(-${targetPage?.offsetLeft}px)`;
    }
  };

  // ブラウザバックなどにも対応
  useEffect(() => {
    window.addEventListener("hashchange", () => {
      const hash = location.hash.replace("#", "");
      setCurrPage(hash);
    });
  }, [setCurrPage]);

  // リサイズ時に対応
  // 処理は重いが一般的に使うことはないので問題ない
  useEffect(() => {
    window.addEventListener("resize", () => {
      changePage(currPage, router);
    });
  }, [currPage, router]);

  // ハッシュの設定
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setCurrPage(hash);
    } else if (defaultPage) {
      setCurrPage(defaultPage);
    }
  }, [defaultPage, setCurrPage]);

  // state が変更されたらページを遷移
  useEffect(() => {
    changePage(currPage, router);
  }, [currPage, router]);

  return (
    <div className={styles.slidesField}>
      <div className={styles.slidesContainer} ref={containerRef}>
        {children}
      </div>
    </div>
  );
};

interface SlideProps {
  children: React.ReactNode;
  pageId: string;
}

export const Slide: React.FC<SlideProps> = ({ children, pageId }) => {
  return (
    <div id={`page-${pageId}`} className={styles.slide}>
      {children}
    </div>
  );
};
