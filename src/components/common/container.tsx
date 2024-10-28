import { ReactNode } from "react";

export const MainContainer: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className: additionalClassName }) => {
  return (
    <div
      className={[
        "flex flex-col justify-center items-center gap-8 w-full grow py-[35px]",
        additionalClassName,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

export const IframeContainer: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className: additionalClassName }) => {
  return (
    <div
      className={[
        "flex flex-row border-2 border-brown grow rounded-[10px] pr-[5px]",
        additionalClassName,
      ].join(" ")}
    >
      {children}
    </div>
  );
};
