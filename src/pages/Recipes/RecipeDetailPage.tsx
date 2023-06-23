import React from "react";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Descriptions,
  Popconfirm,
  Spin,
  Table,
  Tabs,
  Timeline,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Ingredient,
  deleteRecipeGroup,
  getRecipeById,
  getRecipeGroup,
} from "../../api";
import {
  NumberText,
  PageContent,
  PageDetails,
  PageHeader,
  StatusTag,
} from "../../components";
import dayjs from "dayjs";

const RecipeDetailPage: React.FC = () => {
  const { recipeId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = React.useState<
    string | undefined
  >(recipeId);

  const { data: recipe, isLoading: isRecipeLoading } = useQuery({
    queryKey: ["recipe", selectedRecipe],
    queryFn: () => {
      return getRecipeById(selectedRecipe);
    },
  });

  const { data: recipeGroup } = useQuery({
    queryKey: ["recipeGroup", selectedRecipe],
    queryFn: () => {
      return getRecipeGroup(recipe?.recipeGroupId);
    },
    enabled: !!recipe,
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
            format="unit"
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

  if (isRecipeLoading) {
    return (
      <div
        style={{
          height: "300px",
          margin: "20px 0",
          marginBottom: "20px",
          padding: "30px 50px",
          textAlign: "center",
        }}
      >
        <Spin tip="Cargando..."></Spin>
      </div>
    );
  }

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
                hidden={!recipe?.isCurrent}
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
      <PageDetails>
        <Descriptions
          size="small"
          bordered
          column={1}
          style={{ background: "white", borderRadius: "8px" }}
        >
          <Descriptions.Item label="Estado">
            {recipe ? <StatusTag status={recipe?.status} /> : <></>}
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
      </PageDetails>
      <PageContent
        style={{
          padding: 0,
        }}
      >
        {recipe?.isCurrent != undefined ? (
          <Badge.Ribbon
            color={recipe.isCurrent ? "blue" : "orange"}
            text={
              recipe.isCurrent
                ? "Ultima Revisión"
                : `Revision ${recipe?.revision}`
            }
          />
        ) : (
          <></>
        )}
        <Tabs
          className="mx-5"
          defaultActiveKey="1"
          items={[
            {
              key: "Informacion",
              label: "Informacion",
              children: (
                <Table
                  columns={columns}
                  dataSource={recipe?.ingredients}
                  rowKey="Id"
                  pagination={false}
                  className="mb-6"
                />
              ),
            },
            {
              key: "Versiones",
              label: "Versiones Anteriores",
              children: (
                <div className="flex">
                  <Timeline
                    items={(recipeGroup ?? []).map((recipeVersion) => {
                      if (recipeVersion.recipeId == selectedRecipe) {
                        return {
                          color: "black",
                          children: (
                            <>
                              <p>
                                <span>Revision: </span>
                                <NumberText value={recipeVersion.revision} />
                              </p>
                              <p>
                                <span>Creado: </span>
                                <NumberText
                                  value={dayjs(recipeVersion.createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                />
                              </p>
                              <p>
                                <span>
                                  Creado por: {recipeVersion.createdByUserName}
                                </span>
                              </p>
                              <p>
                                <span>
                                  Producto: {recipeVersion.productName}
                                </span>
                              </p>
                              <p>
                                <span>Cantidad: </span>
                                <NumberText
                                  value={recipeVersion.producedQuantity}
                                  unit={recipeVersion.productUnit}
                                  format="unit"
                                  position="right"
                                />
                              </p>
                            </>
                          ),
                        };
                      } else {
                        return {
                          color: "blue",
                          children: (
                            <>
                              <p>
                                <Button
                                  onClick={() =>
                                    setSelectedRecipe(recipeVersion.recipeId)
                                  }
                                >
                                  Ver Revisión {recipeVersion.revision}
                                </Button>
                              </p>
                              <p>
                                <span>Creado: </span>
                                <NumberText
                                  value={dayjs(recipeVersion.createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                />
                              </p>
                              <p>
                                <span>
                                  Creado por: {recipeVersion.createdByUserName}
                                </span>
                              </p>
                              <p>
                                <span>
                                  Producto: {recipeVersion.productName}
                                </span>
                              </p>
                              <p>
                                <span>Cantidad: </span>
                                <NumberText
                                  value={recipeVersion.producedQuantity}
                                  unit={recipeVersion.productUnit}
                                  format="unit"
                                  position="right"
                                />
                              </p>
                            </>
                          ),
                        };
                      }
                    })}
                  />
                </div>
              ),
            },
          ]}
        />
      </PageContent>
    </>
  );
};

export default RecipeDetailPage;
