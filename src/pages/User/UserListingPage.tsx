import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, RoleTag, StatusTag } from "../../components";
import dayjs from "dayjs";
import { Status, User, getAllUsers } from "../../api";
import { ColumnsType } from "antd/es/table";
import { Button, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import { CreateUserFormModal } from "./CreateUserForm";

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

  const [filter, setFilter] = React.useState<Status | undefined>("ACTIVE");

  const { data, isLoading } = useQuery({
    queryKey: ["users", filter],
    queryFn: () => getAllUsers(filter),
  });

  const handleChange = (value: string | Status) => {
    if (value != "ALL") {
      return setFilter(value as Status);
    }
    return setFilter(undefined);
  };

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
    <div>
      <PageHeader
        items={[
          {
            title: <Link to="/app">App</Link>,
          },
          {
            title: "Usuarios",
          },
        ]}
        pageTitle="Usuarios"
      />
      <div className="mx-6s bg-white h-full">
        <div className="flex justify-between gap-3 ">
          <Select
            defaultValue="ACTIVE"
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "ACTIVE", label: "Activos" },
              { value: "INACTIVE", label: "Inactivos" },
              { value: "ALL", label: "Todos" },
            ]}
          />
          <Button icon={<PlusOutlined />} onClick={showModal}>
            Nuevo Usuario
          </Button>
        </div>
        <Table
          rowKey="id"
          loading={isLoading}
          className="mt-3"
          size="small"
          columns={columns}
          dataSource={data}
        />
        <CreateUserFormModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default UserListingPage;
