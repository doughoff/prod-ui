import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NumberText,
  PageContent,
  PageHeader,
  RoleTag,
  StatusTag,
} from "../../components";
import dayjs from "dayjs";
import { Status, User, getUsers } from "../../api";
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
    queryFn: () => getUsers({ status: filter, limit: 200, offset: 0 }),
  });

  const handleChange = (value: string | Status) => {
    return setFilter(value as Status);
  };

  const columns: ColumnsType<User> = [
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (_, row) => (
        <NumberText value={dayjs(row.createdAt).format("DD/MM/YYYY")} />
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
            title: "Usuarios",
          },
        ]}
        pageTitle="Usuarios"
      />

      <PageContent>
        <div className="flex justify-between gap-3 ">
          <Select
            defaultValue="ACTIVE"
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "ACTIVE", label: "Activos" },
              { value: "INACTIVE", label: "Inactivos" },
              { value: "ACTIVE,INACTIVE", label: "Todos" },
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
      </PageContent>
    </>
  );
};

export default UserListingPage;
