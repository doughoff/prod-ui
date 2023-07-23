import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NumberText,
  PageContent,
  PageHeader,
  StatusTag,
} from "../../components";
import dayjs from "dayjs";
import { PageFilters, Status, getProducts } from "../../api";

import { Button, Input, Pagination, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import { CreateProductFormModal } from "./CreateProductForm";
import { statusToStatusList } from "../../utils/enumListParsers";

const ProductListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const showCreateProductModal = () => {
    setIsCreateModalOpen(true);
  };

  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [filters, setFilters] = React.useState<PageFilters>({
    status: "ACTIVE",
    search: undefined,
    pageSize: 10,
    page: 1,
  });

  const { data: result, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => {
      return getProducts({
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
            title: "Productos",
          },
        ]}
        pageTitle="Productos"
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
          <Button icon={<PlusOutlined />} onClick={showCreateProductModal}>
            Nuevo Producto
          </Button>
        </div>
        <Table
          rowKey="id"
          loading={isLoading}
          className="mt-3"
          size="small"
          columns={[
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
          ]}
          dataSource={result?.items}
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
