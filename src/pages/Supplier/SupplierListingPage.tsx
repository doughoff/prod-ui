import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, StatusTag } from "../../components";
import dayjs from "dayjs";
import { Entities, Status, getEntitites } from "../../api";
import { ColumnsType } from "antd/es/table";
import { Button, Input, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import { CreateSupplierFormModal } from "./CreateSupplierForm";

const SupplierListingPage: React.FC = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [filter, setFilter] = React.useState<Status | undefined>("ACTIVE");
  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [searching, setSearching] = React.useState<boolean>(true);

  const { data, isLoading } = useQuery({
    queryKey: ["suppliers", filter, searching],
    queryFn: () =>
      getEntitites({ status: filter, limit: 200, offset: 0, search: search }),
  });

  const handleChange = (value: string | Status) => {
    return setFilter(value as Status);
  };

  const columns: ColumnsType<Entities> = [
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (_, row) => (
        <span>{dayjs(row.createdAt).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      width: 150,
      key: "status",
      render: (_, row) => {
        return <StatusTag status={row.status as Status} />;
      },
    },
    {
      title: "Nombre",
      dataIndex: "name",
      width: 200,
      key: "name",
    },
    {
      title: "RUC",
      dataIndex: "ruc",
      align: "right",
      width: 130,
      key: "RUC",
    },
    {
      title: "CI",
      dataIndex: "ci",
      align: "right",
      width: 130,
      key: "CI",
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
            navigate(`/app/suppliers/info/${row.id}`);
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
            title: "Proveedores",
          },
        ]}
        pageTitle="Proveedores"
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
              { value: "ACTIVE,INACTIVE", label: "Todos" },
            ]}
          />
          <Input.Search
            placeholder="Buscar Proveedor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={() => setSearching(!searching)}
          />
          <Button icon={<PlusOutlined />} onClick={showModal}>
            Nuevo Proveedor
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
        <CreateSupplierFormModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default SupplierListingPage;
