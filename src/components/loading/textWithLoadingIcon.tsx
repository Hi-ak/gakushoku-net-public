import { useEffect, useRef, useState } from "react";
import { LoadingIcon } from "./loadingIcon";

export const TextWithLoadingIcon = ({ children, isLoading }) => {
  const selfRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  }, []);
  return (
    <div
      className="flex flex-row justify-center items-center h-full"
      ref={selfRef}
    >
      {isLoading ? <LoadingIcon /> : children}
    </div>
  );
};
