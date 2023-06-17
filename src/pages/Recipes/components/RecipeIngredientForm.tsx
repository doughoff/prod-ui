import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, InputNumber } from "antd";
import { Controller, useForm } from "react-hook-form";
import { PlusOutlined } from "@ant-design/icons";
import { ProductSelector } from "../../../components";
import { RecipeIngredient, ingredientsSchema } from "../recipeSchema";
import { getProductById } from "../../../api";

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
    formState: { errors },
  } = useForm<IngredientsPayloadType>({
    resolver: zodResolver(ingredientsSchema),
  });

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
          };
        }
        return ingredient;
      });

      setIngredients(updatedIngredients);
    } else {
      setIngredients([...ingredients, newIngredient]);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit((data) => {
        setFocus("productId");
        getProductById(data.productId)
          .then((res) => {
            handleAddIngredient({
              quantity: data.quantity,
              productId: data.productId,
              averageCost: res.averageCost,
              productName: res.name,
              unit: res.unit,
            });
          })
          .catch((err) => console.log(err))
          .finally(() => {
            reset({
              productId: undefined,
              quantity: 1,
            });
          });
      })}
    >
      <div className="flex flex-row gap-2 w-full items-end">
        <Form.Item
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
