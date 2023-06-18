import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NumberText,
  PageContent,
  PageHeader,
  StatusTag,
} from "../../components";
import dayjs from "dayjs";
import { Product, Status, getProducts } from "../../api";
import { ColumnsType } from "antd/es/table";
import { Button, Input, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import { CreateProductFormModal } from "./CreateProductForm";

const ProductListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const showCreateProductModal = () => {
    setIsCreateModalOpen(true);
  };

  const [selectedStatus, setSelectedStatus] = React.useState<Status | "ALL">(
    "ACTIVE"
  );
  const [search, setSearch] = React.useState<string | undefined>(undefined);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", selectedStatus],
    queryFn: () => {
      let statusOptions: Status[] = [];
      if (selectedStatus === "ALL") {
        statusOptions = ["ACTIVE", "INACTIVE"];
      } else {
        statusOptions = [selectedStatus];
      }

      return getProducts({
        status: statusOptions,
        limit: 10,
        offset: 0,
        search: search,
      });
    },
  });

  const handleChange = (value: string | Status) => {
    return setSelectedStatus(value as Status);
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (_, row) => (
        <NumberText value={dayjs(row.createdAt).format("DD/MM/YYYY")} />
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
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Código de barras",
      dataIndex: "barcode",
      align: "right",
      width: 200,
      key: "barcode",
      render: (_, row) => <NumberText value={row?.barcode} />,
    },

    {
      title: "Cantidad",
      dataIndex: "stock",
      align: "right",
      key: "stock",
      width: 100,
      render: (_, row) => (
        <NumberText
          value={row?.stock}
          format="unit"
          unit={row?.unit}
          position="right"
        />
      ),
    },

    {
      title: "Precio Promedio",
      dataIndex: "averageCost",
      align: "right",
      key: "averageCost",
      width: 100,
      render: (_, row) => (
        <NumberText
          value={row?.averageCost}
          format="currency"
          position="right"
        />
      ),
    },
    {
      title: "Fact. de conversión",
      dataIndex: "conversionFactor",
      align: "right",
      key: "conversionFactor",
      width: 100,
      render: (_, row) => <NumberText value={row?.conversionFactor} />,
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
            navigate(`/app/products/info/${row.id}`);
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
            title: "Productos",
          },
        ]}
        pageTitle="Productos"
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
              { value: "ALL", label: "Todos" },
            ]}
          />
          <Input.Search
            placeholder="Buscar Productos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={() => refetch()}
          />
          <Button icon={<PlusOutlined />} onClick={showCreateProductModal}>
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
          isModalOpen={isCreateModalOpen}
          onCancel={() => {
            setIsCreateModalOpen(false);
          }}
        />
      </PageContent>
    </>
  );
};

export default ProductListingPage;
