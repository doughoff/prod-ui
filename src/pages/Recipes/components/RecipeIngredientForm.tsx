import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, InputNumber, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { PlusOutlined } from "@ant-design/icons";
import { ProductSelector } from "../../../components";
import { RecipeIngredient, ingredientsSchema } from "../recipeSchema";
import { Product, getProductById } from "../../../api";
import { currencyFormatter } from "../../../utils/formatters";

type IngredientsPayloadType = z.infer<typeof ingredientsSchema>;

interface Props {
  ingredients: RecipeIngredient[];
  setIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>;
}
const RecipeIngredientForm: React.FC<Props> = ({
  ingredients,
  setIngredients,
}) => {
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    watch,
    formState: { errors },
  } = useForm<IngredientsPayloadType>({
    resolver: zodResolver(ingredientsSchema),
  });
  const [selectedProduct, setSelectedProduct] = React.useState<
    Product | undefined
  >(undefined);

  const handleAddIngredient = (newIngredient: RecipeIngredient) => {
    const existingIngredient = ingredients.find(
      (ingredient) => ingredient.productId === newIngredient.productId
    );

    if (existingIngredient) {
      const updatedIngredients = ingredients.map((ingredient) => {
        if (ingredient.productId === newIngredient.productId) {
          return {
            ...ingredient,
            quantity: ingredient.quantity + newIngredient.quantity,
            total: ingredient.total + newIngredient.total,
          };
        }
        return ingredient;
      });

      setIngredients(updatedIngredients);
    } else {
      setIngredients([...ingredients, newIngredient]);
    }
  };
  const selectedProductId = watch("productId");
  React.useEffect(() => {
    if (selectedProductId) {
      getProductById(selectedProductId)
        .then((res) => setSelectedProduct(res))
        .catch(() => {
          setSelectedProduct(undefined);
          message.error("No fue posible buscar el producto seleccionado");
        });
    } else {
      setSelectedProduct(undefined);
    }
  }, [selectedProductId]);

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit((data) => {
        setFocus("productId");
        console.log(ingredients);
        if (selectedProduct) {
          handleAddIngredient({
            quantity: data.quantity,
            productId: data.productId,
            averageCost: selectedProduct?.averageCost,
            productName: selectedProduct?.name,
            unit: selectedProduct?.unit,
            total: Math.round(selectedProduct?.averageCost * data.quantity),
          });
          reset({
            productId: undefined,
            quantity: 1,
          });
        }
      })}
    >
      <div className="flex flex-row gap-2 w-full items-end">
        <Form.Item
          label="Producto"
          className="w-full"
          validateStatus={errors.productId ? "error" : ""}
          help={errors.productId?.message}
        >
          <Controller
            name="productId"
            control={control}
            defaultValue=""
            render={({ field }) => <ProductSelector {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Cantidad"
          validateStatus={errors.quantity ? "error" : ""}
          help={errors.quantity?.message}
          className="w-40"
        >
          <Controller
            name="quantity"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <InputNumber {...field} min={0.001} className="w-full" />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Costo"
          validateStatus={errors.quantity ? "error" : ""}
          help={errors.quantity?.message}
          className="w-80"
        >
          <InputNumber
            className="w-full"
            value={selectedProduct?.averageCost ?? 0}
            formatter={(v) => currencyFormatter(v, "right")}
            disabled
          />
        </Form.Item>

        <Form.Item
          label="Total"
          validateStatus={errors.quantity ? "error" : ""}
          help={errors.quantity?.message}
          className="w-80"
        >
          <InputNumber
            className="w-full"
            value={Math.round(
              (selectedProduct?.averageCost ?? 0) * watch("quantity")
            )}
            formatter={(v) => currencyFormatter(v, "right")}
            disabled
          />
        </Form.Item>
        <Form.Item className="w-40">
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            className="w-full"
          >
            Agregar
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default RecipeIngredientForm;
