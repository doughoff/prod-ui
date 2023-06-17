import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NumberText,
  PageContent,
  PageHeader,
  StatusTag,
} from "../../components";
import { Button, Select, Table } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Recipe, Status, getRecipes } from "../../api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const RecipesListingPage: React.FC = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = React.useState<Status | undefined>("ACTIVE");

  const { data, isLoading } = useQuery({
    queryKey: ["recipes", filter],
    queryFn: () => getRecipes({ status: filter, limit: 200, offset: 0 }),
  });

  const handleChange = (value: string | Status) => {
    return setFilter(value as Status);
  };

  const columns: ColumnsType<Recipe> = [
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
  ];

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
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "ACTIVE", label: "Activos" },
              { value: "INACTIVE", label: "Inactivos" },
              { value: "ACTIVE,INACTIVE", label: "Todos" },
            ]}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("/app/recipes/create");
            }}
          >
            Nuevo Formula
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

export default RecipesListingPage;
