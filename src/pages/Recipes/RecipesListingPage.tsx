import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NumberText,
  PageContent,
  PageHeader,
  StatusTag,
} from "../../components";
import { Button, Input, Pagination, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { PageFilters, Status, getRecipes } from "../../api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { statusToStatusList } from "../../utils/enumListParsers";

const RecipesListingPage: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [filters, setFilters] = React.useState<PageFilters>({
    status: "ACTIVE",
    search: undefined,
    pageSize: 10,
    page: 1,
  });

  const { data: result, isLoading } = useQuery({
    queryKey: ["recipes", filters],
    queryFn: () => {
      return getRecipes({
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
            title: "Formulas",
          },
        ]}
        pageTitle="Formulas"
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
            placeholder="Buscar por nombre del proveedor"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onSearch={() => setFilters((prev) => ({ ...prev, search }))}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate("/app/recipes/create")}
          >
            Nuevo Formula
          </Button>
        </div>
        <Table
          rowKey="recipeId"
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
              title: "Cantidad",
              dataIndex: "quantity",
              width: 180,
              key: "quantity",
              render: (_, row) => {
                return (
                  <NumberText
                    value={row.producedQuantity}
                    unit={row.productUnit}
                    position="right"
                  />
                );
              },
            },

            {
              title: "Nombre",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "Producto Final",
              dataIndex: "productId",
              key: "productId",
              render: (_, row) => {
                return <span>{row.productName}</span>;
              },
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
              title: "Acciones",
              dataIndex: "actions",
              align: "center",
              key: "actions",
              width: 100,
              render: (_, row) => (
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    navigate(`/app/recipes/info/${row.recipeId}`);
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
      </PageContent>
    </>
  );
};

export default RecipesListingPage;
