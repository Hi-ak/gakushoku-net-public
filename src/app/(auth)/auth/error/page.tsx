"use client";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AuthErrorPage: NextPage = () => {
  return (
    <Suspense>
      <AuthErrorPageContent />
    </Suspense>
  );
};

const AuthErrorPageContent: NextPage = () => {
  let content = <>Auth Error</>;
  const searchParams = useSearchParams();
  switch (searchParams.get("error")) {
    case "AccessDenied":
      content = (
        <>
          <p>
            このアカウントではログインできません
            <br />
            @kaiseigakuen.jp アカウントでログインしてください。
          </p>
          <p>
            高３の利用開始は 2024/9/12（木）
            <br />
            高２、高１の利用開始は 2024/9/16（月）
            <br />
            です。
          </p>
          <p>
            <Link
              href={""}
              onClick={(e) => {
                e.preventDefault();
                signIn("google");
              }}
            >
              再ログイン
            </Link>
          </p>
        </>
      );
      break;
  }
  return (
    <div className="grow p-10">
      <h1 className="text-primary text-4xl font-bold mb-3">ログインエラー</h1>
      {content}
    </div>
  );
};

export default AuthErrorPage;
