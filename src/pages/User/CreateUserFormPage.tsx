import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components";
import { CreateUserForm } from "./CreateUserForm";

const CreateUserFormPage: React.FC = () => {
  return (
    <>
      <PageHeader
        items={[
          {
            title: <Link to="/app">App</Link>,
          },
          {
            title: <Link to="/app/users">Usuários</Link>,
          },
          {
            title: "Create",
          },
        ]}
        pageTitle="Usuários"
      />
      <div className="p-6">
        <CreateUserForm />
      </div>
    </>
  );
};
export default CreateUserFormPage;
