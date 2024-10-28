"use client";

import { IframeContainer, MainContainer } from "@/components/common/container";
import { NextPage } from "next";
import thumbnail from "@/public/guide-thumbnail.png";

const TermsPage: NextPage = () => {
  return (
    <MainContainer>
      <h1>利用案内</h1>
      <h2>目次</h2>
      <ul>
        <li>
          ・<a href="#guide-video">利用案内動画</a>
        </li>
        <li>
          ・<a href="#guide">利用案内文</a>
        </li>
      </ul>
      <h2 id="guide-video">利用案内動画</h2>
      <video
        src="https://lddwukikhdsofksyfvpb.supabase.co/storage/v1/object/public/cafeteria/guide.mp4?t=2024-09-10T06%3A03%3A59.552Z"
        controls
        className="h-[calc(100dvh-var(--header-height)-10px)]"
        poster={thumbnail.src}
      ></video>
      <h2 id="guide">利用案内文</h2>
      <IframeContainer className="w-[90%]">
        <iframe src="/public/guide.html" className="w-full h-[32rem]"></iframe>
      </IframeContainer>
    </MainContainer>
  );
};

export default TermsPage;
