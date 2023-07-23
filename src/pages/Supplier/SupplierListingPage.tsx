import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NumberText,
  PageContent,
  PageHeader,
  StatusTag,
} from "../../components";
import dayjs from "dayjs";
import { PageFilters, Status, getEntitites } from "../../api";
import { Button, Input, Pagination, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { CreateSupplierFormModal } from "./CreateSupplierForm";
import { statusToStatusList } from "../../utils/enumListParsers";

const SupplierListingPage: React.FC = () => {
  const navigate = useNavigate();

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
    queryKey: ["suppliers", filters],
    queryFn: () => {
      return getEntitites({
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
            title: "Proveedores",
          },
        ]}
        pageTitle="Proveedores"
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
          <Button icon={<PlusOutlined />} onClick={() => showModal()}>
            Nuevo Proveedor
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
              render: (_, row) => <NumberText value={row.ruc} />,
            },
            {
              title: "CI",
              dataIndex: "ci",
              align: "right",
              width: 130,
              key: "CI",
              render: (_, row) => <NumberText value={row.ci} />,
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
                    navigate(`/app/suppliers/info/${row.id}`);
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
        <CreateSupplierFormModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </PageContent>
    </>
  );
};

export default SupplierListingPage;
