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
import { PageFilters, User, getUsers } from "../../api";
import { Button, Input, Pagination, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import { CreateUserFormModal } from "./CreateUserForm";
import { statusToStatusList } from "../../utils/enumListParsers";

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
  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [filters, setFilters] = React.useState<PageFilters>({
    status: "ACTIVE",
    search: undefined,
    pageSize: 10,
    page: 1,
  });

  const { data: result, isLoading } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => {
      return getUsers({
        search: filters.search,
        status: statusToStatusList(filters.status),
        offset: (filters.page - 1) * filters.pageSize,
        limit: filters.pageSize,
      });
    },
  });

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
            style={{ width: 150 }}
            onChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                status: value as PageFilters["status"],
              }));
            }}
            options={[
              { value: "ACTIVE", label: "Activos" },
              { value: "INACTIVE", label: "Inactivos" },
              { value: "ALL", label: "Todos" },
            ]}
          />
          <Input.Search
            placeholder="Buscar por nombre del usuario"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onSearch={() => setFilters((prev) => ({ ...prev, search }))}
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
          dataSource={result?.items}
          columns={[
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
              align: "center",
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
          ]}
          pagination={false}
        />
        <Pagination
          className="mt-3 float-right"
          showSizeChanger
          total={result?.totalCount || 0}
          current={filters.page}
          pageSize={filters.pageSize}
          onChange={(page) => {
            setFilters((prev) => ({
              ...prev,
              page,
            }));
          }}
          onShowSizeChange={(current, size) => {
            setFilters((prev) => ({
              ...prev,
              page: current,
              pageSize: size,
            }));
          }}
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
