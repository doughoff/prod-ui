import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NumberText,
  PageContent,
  PageHeader,
  StatusTag,
} from "../../components";
import dayjs from "dayjs";
import { Status, StockMovement } from "../../api";
import { ColumnsType } from "antd/es/table";
import { Button, Input, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useQuery } from "@tanstack/react-query";

const StockEntryListingPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = React.useState<Status | "ALL">("ACTIVE");
  const [search, setSearch] = React.useState<string | undefined>(undefined);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["stock_entries", selectedStatus],
    queryFn: () => {
      // let statusOptions: Status[] = [];
      // if (selectedStatus === "ALL") {
      //   statusOptions = ["ACTIVE", "INACTIVE"];
      // }
      // else {
      //   statusOptions = [selectedStatus];
      // }

      return []
    },
    enabled: false,
  });

  const handleChange = (value: string | Status) => {
    return setSelectedStatus(value as Status);
  };

  const columns: ColumnsType<StockMovement> = [
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
      title: "Nombre del Proveedor",
      dataIndex: "entityName",
      key: "entityName",
    },
    {
      title: "Total",
      dataIndex: "total",
      align: "right",
      key: "averageCost",
      width: 100,
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
          <Button icon={<PlusOutlined />} >
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
      </PageContent>
    </>
  );
};

export default StockEntryListingPage;
