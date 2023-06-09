import { Link, useNavigate } from "react-router-dom";
import { PageHeader, RoleTag, StatusTag } from "../../components";
import { Button, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { User } from "../../api";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import CreateUserFormModal from "./UserFormModal";

const UserListingPage: React.FC = () => {
  const navigate = useNavigate();
  const userRoles = (user: User): React.ReactNode => {
    const tags = user.roles.map((role) => <RoleTag key={role} role={role} />);
    if (tags.length === 0) {
      return <span>Sin Roles</span>;
    }
    return tags;
  };
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const data: User[] = [
    {
      id: "alexisduche",
      status: "ACTIVE",
      name: "Alexis Duche",
      email: "alexisduche@gmail.com",
      password: "123456",
      createdAt: new Date(2018, 15, 24, 10, 33, 30),
      updatedAt: new Date(2018, 15, 24, 10, 33, 30),
      roles: ["ADMIN", "OPERATOR"],
    },
  ];
  const columns: ColumnsType<User> = [
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (_, row) => (
        <span>{dayjs(row.createdAt).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      width: 150,
      key: "status",
      render: (_, row) => <StatusTag status={row.status} />,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (_, row) => {
        return userRoles(row);
      },
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      width: 100,
      render: (_, row) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            navigate(`/app/users/info/${row.id}`);
          }}
          icon={<EyeOutlined />}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        items={[
          {
            title: <Link to="/app">App</Link>,
          },
          {
            title: "Usuários",
          },
        ]}
        pageTitle="Usuários"
      />
      <div className="p-6">
        <div className="flex justify-between gap-3">
          <Select
            defaultValue="active"
            style={{ width: 120 }}
            options={[
              { value: "active", label: "Activos" },
              { value: "inactive", label: "Inactivos" },
              { value: "all", label: "Todos" },
            ]}
          />
          <Button
            icon={<PlusOutlined />}
            // onClick={() => {
            //   navigate('/app/users/create')
            // }}
            onClick={showModal}
          >
            Nuevo Usuario
          </Button>
        </div>
        <Table
          className="mt-3"
          size="small"
          columns={columns}
          dataSource={data}
        />
        <CreateUserFormModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleOk={handleOk}
        />
      </div>
    </>
  );
};

export default UserListingPage;
