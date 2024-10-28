"use client";

import {
  InitParameterPostRequestBody,
  InitParameterPostResponseBody,
} from "@/app/api/dev/parameter/init/route";
import { jsonFetch } from "@/common/utils/customFetch";
import { useState } from "react";

export const ParameterInitPageContent: React.FC<{
  cafeteriaHandle: string;
}> = ({ cafeteriaHandle }) => {
  const [text, setText] = useState("");
  return (
    <div className="grow flex flex-col gap-3 items-center justify-center">
      <button
        onClick={async () => {
          const res = await jsonFetch("/api/dev/parameter/init", "POST", {
            cafeteriaHandle,
          } as InitParameterPostRequestBody);
          const resBody = (await res.json()) as Object;
          setText(JSON.stringify(resBody));
        }}
        className="px-5 py-2 border-2 rounded-xl"
      >
        パラメータを初期化
      </button>
      <p>{text}</p>
    </div>
  );
};
