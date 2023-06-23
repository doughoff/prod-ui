import React from "react";
import { PageContent, PageHeader } from "../../components";

const IndexPage: React.FC = () => {
  return (
    <>
      <PageHeader
        items={[
          {
            title: "App",
          },
        ]}
        pageTitle="Pagina de Inicio"
      />
      <PageContent>
        <></>
      </PageContent>
    </>
  );
};

export default IndexPage;
