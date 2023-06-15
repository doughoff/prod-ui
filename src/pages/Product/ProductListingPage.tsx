import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, StatusTag, UnitTag } from "../../components";
import dayjs from "dayjs";
import { Product, Status, getProducts } from "../../api";
import { ColumnsType } from "antd/es/table";
import { Button, Input, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import { CreateProductFormModal } from "./CreateProductForm";

const ProductListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [filter, setFilter] = React.useState<Status | undefined>("ACTIVE");
  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [searching, setSearching] = React.useState<boolean>(true);

  const { data, isLoading } = useQuery({
    queryKey: ["products", filter, searching],
    queryFn: () =>
      getProducts({ status: filter, limit: 10, offset: 0, search: search }),
  });

  const handleChange = (value: string | Status) => {
    return setFilter(value as Status);
  };

  const columns: ColumnsType<Product> = [
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
      width: 80,
      key: "status",
      render: (_, row) => {
        return <StatusTag status={row.status as Status} />;
      },
    },
    {
      title: "Código de barras",
      dataIndex: "barcode",
      align: "right",
      width: 200,
      key: "barcode",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Lotes",
      dataIndex: "batchControl",
      key: "batchControl",
      width: 100,
      render: (_, row) => {
        return row.batchControl ? "Si" : "No";
      },
    },
    {
      title: "Und.",
      dataIndex: "unit",
      key: "unit",
      width: 100,
      render: (_, row) => {
        return <UnitTag unit={row.unit} />;
      },
    },
    {
      title: "Fact. de conversión",
      dataIndex: "conversionFactor",
      align: "right",
      key: "conversionFactor",
      width: 100,
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
            navigate(`/app/products/info/${row.id}`);
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
            title: "Productos",
          },
        ]}
        pageTitle="Productos"
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
            placeholder="Buscar Productos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={() => setSearching(!searching)}
          />
          <Button icon={<PlusOutlined />} onClick={showModal}>
            Nuevo Producto
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
        <CreateProductFormModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default ProductListingPage;
