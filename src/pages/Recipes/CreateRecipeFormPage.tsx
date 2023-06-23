import React from "react";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  FormItemGroup,
  NumberText,
  PageContent,
  PageHeader,
  ProductSelector,
} from "../../components";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Table,
  Typography,
  message,
} from "antd";
import { createRecipes } from "../../api";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { RecipeIngredient, recipeSchema } from "./recipeSchema";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RecipeIngredientForm } from "./components";

type CreateRecipePayloadType = z.infer<typeof recipeSchema>;

const CreateRecipeFormPage: React.FC = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = React.useRef<any>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateRecipePayloadType>({
    resolver: zodResolver(recipeSchema),
  });

  const [ingredients, setIngredients] = React.useState<RecipeIngredient[]>([]);

  const removeItem = (data: RecipeIngredient[], productId: string) => {
    const filtered = data.filter((item) => item.productId !== productId);
    setIngredients(filtered);
  };

  const createNewRecipe = React.useCallback(
    (data: CreateRecipePayloadType) => {
      return createRecipes({
        name: data.name,
        ingredients: ingredients.map((ingredient) => {
          return {
            productId: ingredient.productId,
            quantity: ingredient.quantity,
          };
        }),
        productId: data.productId,
        producedQuantity: data.producedQuantity,
      });
    },
    [ingredients]
  );

  const { isPending, mutate } = useMutation({
    mutationFn: createNewRecipe,
    onSuccess: () => {
      message.success("Formula Registrada");
      navigate("/app/recipes");
    },
    onError: () => {
      message.error("Error al registrar la formula");
    },
  });

  const totalSum = React.useMemo(() => {
    const totalSum = ingredients.reduce(
      (sum: number, ingredient: RecipeIngredient) => sum + ingredient.total,
      0
    );
    return totalSum;
  }, [ingredients]);

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
            title: "Nueva Formula",
          },
        ]}
        content={
          <div className="flex justify-between">
            <Typography.Title level={3}>Crear Nueva Formula</Typography.Title>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              onClick={() => {
                formRef.current.submit();
              }}
              loading={isPending}
            >
              Guardar Fromula
            </Button>
          </div>
        }
      />
      <Card>
        <Typography.Title level={4}>Formula</Typography.Title>
        <Form
          ref={formRef}
          onFinish={handleSubmit((data) => {
            if (ingredients.length > 0) {
              return mutate(data);
            } else {
              console.log(data);
              message.error("La formula debe tener algun ingrediente");
            }
          })}
        >
          <Divider className="my-3" />
          <FormItemGroup
            inputs={
              <Form.Item
                validateStatus={errors.name ? "error" : ""}
                help={errors.name?.message}
              >
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input placeholder="Nombre de la Formula" {...field} />
                  )}
                />
              </Form.Item>
            }
            title="Nombre de la Formula"
          />
          <Divider className="mt-0" />
          <FormItemGroup
            inputs={
              <Form.Item
                validateStatus={errors.productId ? "error" : ""}
                help={errors.productId?.message}
              >
                <Controller
                  name="productId"
                  control={control}
                  render={({ field }) => (
                    <ProductSelector
                      placeholder="Selecciona un Producto"
                      {...field}
                    />
                  )}
                />
              </Form.Item>
            }
            title="Producto a Producir"
          />
          <Divider className="mt-0" />
          <FormItemGroup
            inputs={
              <Form.Item
                validateStatus={errors.producedQuantity ? "error" : ""}
                help={errors.producedQuantity?.message}
              >
                <Controller
                  name="producedQuantity"
                  control={control}
                  defaultValue={1}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={0.001}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Form.Item>
            }
            title="Cantidad a Producir"
          />
        </Form>
      </Card>
      <PageContent>
        <div className="flex justify-between align-baseline mb-3">
          <Typography.Title level={4} className="">
            Ingredientes
          </Typography.Title>
          <div className="flex gap-2 align-baseline">
            <span>
              <strong>Costo por Unidad: </strong>
              <NumberText
                value={Math.round(totalSum / watch("producedQuantity") ?? 0)}
                format="currency"
                position="right"
              />
            </span>
            <span>
              <strong>Costo Total: </strong>
              <NumberText value={totalSum} format="currency" position="right" />
            </span>
          </div>
        </div>
        <RecipeIngredientForm
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
        <Table
          columns={[
            {
              title: "Cantidad",
              dataIndex: "quantity",
              width: 80,
              key: "quantity",
              render: (_, row) => {
                return (
                  <NumberText
                    value={row.quantity}
                    unit={row.unit}
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
            {
              title: "Costo Unitario",
              dataIndex: "averageCost",
              key: "averageCost",
              align: "right",
              width: 125,
              render: (_, row) => (
                <NumberText
                  value={row.averageCost}
                  format="currency"
                  position="right"
                />
              ),
            },
            {
              title: "Total",
              align: "right",
              dataIndex: "total",
              key: "averageCost",
              width: 165,
              render: (_, row) => (
                <NumberText
                  value={row.total}
                  format="currency"
                  position="right"
                />
              ),
            },
            {
              title: "Acciones",
              key: "actions",
              dataIndex: "actions",
              width: 100,
              render: (_, row) => (
                <div className="flex flex-row-reverse pr-1">
                  <Button
                    danger
                    onClick={() => {
                      removeItem(ingredients, row.productId);
                    }}
                    icon={<DeleteOutlined />}
                  />
                </div>
              ),
            },
          ]}
          dataSource={ingredients}
          rowKey="productId"
          pagination={false}
        />
      </PageContent>
    </>
  );
};

export default CreateRecipeFormPage;
