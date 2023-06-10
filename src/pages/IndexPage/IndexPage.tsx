import React from "react";
import { PageHeader } from "../../components";
import { getAllUsers } from "../../api/userRepository";

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
          getAllUsers("INACTIVE");
        }}
      >
        Test Button
      </button>
    </>
  );
};

export default IndexPage;
