"use client";
import Cookies from "js-cookie";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { SessionProvider, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";

const Step: React.FC<{ step: number; maxStep: number }> = ({
  step,
  maxStep,
}) => {
  return (
    <div className="w-full h-[50px] flex flex-row items-center justify-center text-xl bg-primary font-extrabold text-white absolute top-[20px]">
      ログインステップ {step}/{maxStep}
    </div>
  );
};

const MainContainer: React.FC<{ children: ReactNode; step: number }> = ({
  children,
  step,
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-8 w-full h-full py-[60px] pt-[100px]">
      <Step step={step} maxStep={3} />
      {children}
    </div>
  );
};

const IframeContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex flex-row gap-5 w-[90%] grow">{children}</div>;
};

const Iframe: React.FC<{ src?: string }> = ({ src }) => {
  return (
    <div className="flex flex-row border-2 border-brown grow rounded-[10px] pr-[5px]">
      <iframe src={src} className="w-full h-full"></iframe>
    </div>
  );
};

const NextButton: React.FC<{
  nextStep: number;
  setStep: (phase: number) => void;
}> = ({ nextStep, setStep }) => {
  return (
    <div
      onClick={() => {
        setStep(nextStep);
      }}
      className={
        "bg-primary hover:bg-primary/75 cursor-pointer py-3 w-[200px] text-center rounded select-none"
      }
    >
      同意する
    </div>
  );
};

const LoginPage: NextPage = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const ln = () => {
    const hash = location.hash.replace("#", "");
    setStep(Number(hash));
  };

  useEffect(() => {
    window.addEventListener("hashchange", ln);
    return () => {
      window.removeEventListener("hashchange", ln);
    };
  }, [setStep]);

  useEffect(() => {
    router.push(`#${step}`);
  }, [step]);

  const Pages: ReactNode[] = [
    <MainContainer key={1} step={1}>
      <p className="m-0">利用規約に同意してください。</p>
      <IframeContainer>
        <Iframe key={1} src="/public/terms-of-service.html" />
      </IframeContainer>
      <NextButton nextStep={2} setStep={setStep} />
    </MainContainer>,
    <MainContainer key={2} step={2}>
      <p className="m-0">利用案内に同意してください。</p>
      <IframeContainer>
        <Iframe key={2} src="/public/guide.html" />
      </IframeContainer>
      <NextButton nextStep={3} setStep={setStep} />
    </MainContainer>,
    <MainContainer key={3} step={3}>
      <div
        onClick={() => {
          signIn("google");
        }}
        className={
          "bg-primary hover:bg-primary/75 cursor-pointer py-3 w-[200px] text-center rounded select-none"
        }
      >
        ログイン
      </div>
    </MainContainer>,
  ];
  return <SessionProvider>{Pages[step - 1]}</SessionProvider>;
};

export default LoginPage;
