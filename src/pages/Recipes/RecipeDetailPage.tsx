import React from "react";
import {
  Card,
  NumberText,
  PageDetails,
  PageHeader,
  StatusTag,
} from "../../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipeGroup, getRecipeById } from "../../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Popconfirm,
  Table,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Ingredient } from "../../api";

const RecipeDetailPage: React.FC = () => {
  const { recipeId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipeById(recipeId),
  });

  const isRecipeActive = data?.status === "ACTIVE" ?? false;
  const columns: ColumnsType<Ingredient> = [
    {
      title: "Cantidad",
      dataIndex: "quantity",
      width: 80,
      key: "quantity",
      render: (_, row) => {
        return (
          <NumberText
            value={row.quantity}
            unit={row.productUnit}
            position="right"
          />
        );
      },
    },
    {
      title: "Producto",
      dataIndex: "productName",
      key: "productName",
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
            title: <Link to="/app/recipes">Formulas</Link>,
          },
          {
            title: `${data?.name}`,
          },
        ]}
        content={
          <div className="flex justify-between">
            <Typography.Title level={3}>
              {"Información de " + data?.name}
            </Typography.Title>
            <div className="flex gap-2">
              <Button
                icon={<EditOutlined />}
                onClick={() => navigate(`/app/recipes/edit/${data?.recipeId}`)}
              >
                Editar
              </Button>
              {data && (
                <Popconfirm
                  placement="bottom"
                  title={
                    isRecipeActive ? "Desactivar Producto" : "Activar Producto"
                  }
                  description="¿Está seguro que desea cambiar el estado del producto?"
                  okText="Sí"
                  cancelText="No"
                  onConfirm={() => {
                    deleteRecipeGroup(
                      {
                        status: isRecipeActive ? "INACTIVE" : "ACTIVE",
                      },
                      data.recipeGroupId
                    )
                      .then(() => {
                        message.info("Formula actualizado correctamente");
                      })
                      .catch(() => {
                        message.error("Error al actualizar el formula");
                      })
                      .finally(() => {
                        queryClient.invalidateQueries({
                          queryKey: ["recipe"],
                        });
                      });
                  }}
                >
                  <Button
                    type="primary"
                    danger={isRecipeActive}
                    icon={
                      isRecipeActive ? <DeleteOutlined /> : <CheckOutlined />
                    }
                  >
                    {isRecipeActive ? "Desactivar" : "Activar"}
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        }
      />
      <PageDetails>
        <Descriptions
          bordered
          column={1}
          style={{ background: "white", borderRadius: "8px" }}
        >
          <Descriptions.Item label="Nombre">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="Estado">
            {data ? <StatusTag status={data?.status} /> : <></>}
          </Descriptions.Item>
          <Descriptions.Item label="Creado Por">
            {data?.createdByUserName}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Creación">
            <NumberText value={dayjs(data?.createdAt).format("DD/MM/YYYY")} />
          </Descriptions.Item>
          <Descriptions.Item label="Producto">
            {data?.productName}
          </Descriptions.Item>
          <Descriptions.Item label="Cantidad estimada de Producción">
            {data?.producedQuantity}
          </Descriptions.Item>
        </Descriptions>
      </PageDetails>
      <Card>
        <Table
          columns={columns}
          dataSource={data?.ingredients}
          rowKey="Id"
          pagination={false}
          className="mb-6"
        />
      </Card>
    </>
  );
};

export default RecipeDetailPage;
