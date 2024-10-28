"use client";
import { customFetch } from "@/common/utils/customFetch";

export const ResetPageContent: React.FC = () => {
  return (
    <div
      className="cursor-pointer"
      onClick={async () => {
        await customFetch("/api/reset", "POST");
      }}
    >
      Reset Data
    </div>
  );
};
