"use client";

import { IframeContainer, MainContainer } from "@/components/common/container";
import { NextPage } from "next";

const TermsPage: NextPage = () => {
  return (
    <MainContainer>
      <h1>利用規約</h1>
      <IframeContainer className="w-[90%] grow">
        <iframe src="/public/terms-of-service.html" className="w-full"></iframe>
      </IframeContainer>
    </MainContainer>
  );
};

export default TermsPage;
