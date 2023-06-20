import React from "react";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Popconfirm,
  Table,
  Tabs,
  Timeline,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Ingredient,
  Recipe,
  deleteRecipeGroup,
  getRecipeById,
  getRecipeGroup,
} from "../../api";
import {
  NumberText,
  PageContent,
  PageHeader,
  StatusTag,
} from "../../components";

const RecipeDetailPage: React.FC = () => {
  const { recipeId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = React.useState<
    string | undefined
  >(recipeId);
  const [recipeGroup, setRecipeGroup] = React.useState<Recipe[]>([]);

  const GetRecipeGroup = (recipeGroupId: string | undefined) => {
    getRecipeGroup(recipeGroupId)
      .then((res) => setRecipeGroup(res))
      .catch(() =>
        message.error("Error al buscar las versiones de la formula")
      );
  };
  const { data: recipe } = useQuery({
    queryKey: ["recipe", selectedRecipe],
    queryFn: () => {
      if (recipeGroup.length == 0) {
        return getRecipeById(selectedRecipe).then((res) => {
          GetRecipeGroup(res.recipeGroupId);
          return res;
        });
      } else {
        return getRecipeById(selectedRecipe);
      }
    },
  });

  const isRecipeActive = recipe?.status === "ACTIVE" ?? false;

  const totalSum = React.useMemo(() => {
    const totalSum = recipe?.ingredients.reduce(
      (sum: number, ingredient: Ingredient) =>
        sum +
        Math.round((ingredient?.averageCost ?? 1500) * ingredient.quantity),
      0
    );
    return totalSum;
  }, [recipe]);

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
            title: `${recipe?.name}`,
          },
        ]}
        content={
          <div className="flex justify-between">
            <Typography.Title level={3}>
              {"Información de " + recipe?.name}
            </Typography.Title>
            <div className="flex gap-2">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(`/app/recipes/edit/${recipe?.recipeId}`)
                }
              >
                Editar
              </Button>
              {recipe && (
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
                      recipe.recipeGroupId
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
      <Tabs
        type="card"
        className="mx-6 bg-white rounded-t-lg h-full "
        defaultActiveKey="1"
        items={[
          {
            key: "Informacion",
            label: "Informacion",
            children: (
              <PageContent
                className="!mx-0 !rounded-none"
                style={{
                  margin: "-16px",
                  borderLeft: "1px solid #f0f0f0",
                  borderRight: "1px solid #f0f0f0",
                }}
              >
                <div className="mb-6">
                  <Descriptions
                    bordered
                    column={1}
                    style={{ background: "white", borderRadius: "8px" }}
                  >
                    <Descriptions.Item label="Nombre">
                      {recipe?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Estado">
                      {recipe ? <StatusTag status={recipe?.status} /> : <></>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Creado Por">
                      {recipe?.createdByUserName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Fecha de Creación">
                      <NumberText
                        value={dayjs(recipe?.createdAt).format(
                          "DD/MM/YYYY HH:mm A"
                        )}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Producto">
                      {recipe?.productName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Cantidad estimada de Producción">
                      <NumberText value={recipe?.producedQuantity} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Costo Unitario">
                      <NumberText
                        value={Math.round(
                          (totalSum ?? 0) / (recipe?.producedQuantity ?? 0)
                        )}
                        format="currency"
                        position="right"
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Costo Total">
                      <NumberText
                        value={Math.round(totalSum ?? 0)}
                        format="currency"
                        position="right"
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <Table
                  columns={columns}
                  dataSource={recipe?.ingredients}
                  rowKey="Id"
                  pagination={false}
                  className="mb-6"
                />
              </PageContent>
            ),
          },
          {
            disabled: recipeGroup.length <= 1,
            key: "Versiones",
            label: "Versiones Anteriores",
            children: (
              <PageContent
                className="!mx-0 p-6 !rounded-none "
                style={{
                  marginTop: "-16px",
                  borderLeft: "1px solid #f0f0f0",
                  borderRight: "1px solid #f0f0f0",
                }}
              >
                <div className="flex">
                  <Timeline
                    items={recipeGroup.map((ingredients) => {
                      if (ingredients.recipeId == selectedRecipe) {
                        return {
                          color: "green",
                          children: (
                            <span>{`Version ${ingredients.revision}`}</span>
                          ),
                        };
                      } else {
                        return {
                          color: "blue",
                          children: (
                            <span
                              className="text-blue-500 cursor-pointer"
                              onClick={() => {
                                setSelectedRecipe(ingredients.recipeId);
                              }}
                            >{`Version ${ingredients.revision}`}</span>
                          ),
                        };
                      }
                    })}
                  />
                </div>
              </PageContent>
            ),
          },
        ]}
      />
    </>
  );
};

export default RecipeDetailPage;
