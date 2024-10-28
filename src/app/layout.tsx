import type { Metadata } from "next";
import { Inter, Kaisei_Decol } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "学食ネット",
  description:
    "学生食堂の食券を事前にモバイルオーダーし、短い待ち時間で利用しよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="https://gakushoku.net/icon/192x192.png"
          type="image/png"
          sizes="192x192"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
