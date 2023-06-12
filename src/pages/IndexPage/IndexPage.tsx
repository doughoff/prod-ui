import React from "react";
import { PageHeader } from "../../components";
import { checkEmail } from "../../api";

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
      <button
        onClick={() => {
          checkEmail("st@test.com");
        }}
      >
        Test
      </button>
      <button
        onClick={() => {
          localStorage.removeItem("sessionID");
        }}
      >
        Localstorage Clear
      </button>
    </>
  );
};

export default IndexPage;
