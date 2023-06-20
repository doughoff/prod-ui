import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NumberText,
  PageContent,
  PageHeader,
  StatusTag,
} from "../../components";
import dayjs from "dayjs";
import { PageFilters, Status } from "../../api";
import { Button, Input, Pagination, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";
import { getStockMovements } from "../../api/stockMovementRepository";
import { statusToStatusList } from "../../utils/enumListParsers";
import { useDebouncedEffect } from "../../hooks";

const StockEntryListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [filters, setFilters] = React.useState<PageFilters>({
    status: "ACTIVE",
    search: undefined,
    pageSize: 10,
    page: 1,
  });

  const { data: result, isLoading } = useQuery({
    queryKey: ["stock_entries", filters],
    queryFn: () => {
      return getStockMovements({
        search: filters.search,
        status: statusToStatusList(filters.status),
        offset: (filters.page - 1) * filters.pageSize,
        limit: filters.pageSize,
        type: ["PURCHASE"],
      });
    },
  });

  useDebouncedEffect(
    () => {
      setFilters((prev) => ({ ...prev, search: search }));
    },
    500,
    [search]
  );

  return (
    <>
      <PageHeader
        items={[
          {
            title: <Link to="/app">App</Link>,
          },
          {
            title: "Entradas de Stock",
          },
        ]}
        pageTitle="Entradas de Stock"
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
          <Button icon={<PlusOutlined />}>Nueva Entrada</Button>
        </div>
        <Table
          rowKey="id"
          loading={isLoading}
          className="mt-3"
          size="small"
          columns={[
            {
              title: "Fecha",
              dataIndex: "fechas",
              key: "fechas",
              width: 100,
              render: (_, row) => (
                <NumberText value={dayjs(row.date).format("DD/MM/YYYY")} />
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
              title: "Nombre del Proveedor",
              dataIndex: "entityName",
              key: "entityName",
            },
            {
              title: "Total",
              dataIndex: "total",
              align: "right",
              key: "averageCost",
              width: 250,
              render: (_, row) => (
                <NumberText
                  value={row?.total}
                  format="currency"
                  position="right"
                />
              ),
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
      </PageContent>
    </>
  );
};

export default StockEntryListingPage;
