import React from "react";
import { PageHeader } from "../../components";

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
    </>
  );
};

export default IndexPage;
