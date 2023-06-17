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
import { ColumnsType } from "antd/es/table";
import { createRecipes } from "../../api";
import { SaveOutlined } from "@ant-design/icons";
import { RecipeIngredient, recipeSchema } from "./recipeSchema";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RecipeIngredientForm } from "./components";

type CreateRecipePayloadType = z.infer<typeof recipeSchema>;

const CreateRecipeFormPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRecipePayloadType>({
    resolver: zodResolver(recipeSchema),
  });

  const navigate = useNavigate();
  const formRef = React.useRef<unknown>();

  const [ingredients, setIngredients] = React.useState<RecipeIngredient[]>([]);

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

  const columns: ColumnsType<RecipeIngredient> = [
    {
      title: "Producto",
      dataIndex: "productName",
      key: "createdAt",
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      width: 160,
      key: "quantity",
      render: (_, row) => {
        return (
          <NumberText value={row.quantity} unit={row.unit} position="right" />
        );
      },
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
        <Typography.Title level={4}>Ingredientes</Typography.Title>
        <RecipeIngredientForm
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
        <Table columns={columns} dataSource={ingredients} />
      </PageContent>
    </>
  );
};

export default CreateRecipeFormPage;
