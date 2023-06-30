import React from "react";
import * as z from "zod";
import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ProductSelector } from "../../../components";
import { currencyFormatter, currencyParser } from "../../../utils/formatters";
import { PlusOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, getProductById } from "../../../api";
import { SaleItems, saleItemSchema } from "../saleSchema";

interface Props {
  items: SaleItems[];
  setItems: React.Dispatch<React.SetStateAction<SaleItems[]>>;
}

type saleItemPayloadType = z.infer<typeof saleItemSchema>;

const SaleItemForm: React.FC<Props> = ({ setItems, items }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setFocus,
    reset,
    watch,
  } = useForm<saleItemPayloadType>({
    resolver: zodResolver(saleItemSchema),
  });
  const [selectedProduct, setSelectedProduct] = React.useState<
    Product | undefined
  >(undefined);

  const handleAddItems = (newItem: SaleItems) => {
    const existingItem = items.find((item) => {
      return (
        item.productId === newItem.productId &&
        item.batch === newItem.batch &&
        item.price === newItem.price
      );
    });

    if (existingItem) {
      const updatedItems = items.map((item: SaleItems) => {
        if (
          item.productId === newItem.productId &&
          item.batch === newItem.batch &&
          item.price === newItem.price
        ) {
          return {
            ...item,
            quantity: item.quantity + newItem.quantity,
            total: item.total + newItem.total,
          };
        }
        return item;
      });

      setItems(updatedItems);
    } else {
      setItems([...items, newItem]);
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
      className="my-3 flex gap-3 mx-auto"
      layout="vertical"
      onFinish={handleSubmit((data) => {
        setFocus("productId");

        if (selectedProduct) {
          if (selectedProduct.batchControl) {
            setTimeout(() => {
              setFocus("batch");
            }, 500);

            Modal.confirm({
              title: "Completa el lote del producto",
              content: (
                <Form layout="vertical">
                  <Form.Item
                    label="Lote"
                    validateStatus={errors.batch ? "error" : ""}
                    help={errors.batch?.message}
                  >
                    <Controller
                      name="batch"
                      control={control}
                      render={({ field }) => <Input {...field} />}
                    />
                  </Form.Item>
                </Form>
              ),
              onOk: () => {
                if (data.batch === "") {
                  message.error("Lote es requerido");
                  return false;
                }
                handleAddItems({
                  productId: data.productId,
                  quantity: data.quantity,
                  price: data.price,
                  productName: selectedProduct?.name ?? "",
                  batch: getValues("batch"),
                  unit: selectedProduct?.unit ?? "OTHER",
                  total: Math.round(data.price * data.quantity),
                });
                reset({
                  productId: undefined,
                  quantity: 1,
                  price: 1,
                  batch: undefined,
                });

                setFocus("productId");
              },
              onCancel: () => {
                message.error(
                  "No fue posible agregar el producto, lote es requerido"
                );
                reset({
                  productId: undefined,
                  quantity: 1,
                  price: 1,
                  batch: undefined,
                });
              },
            });
          } else {
            handleAddItems({
              productId: data.productId,
              quantity: data.quantity,
              price: data.price,
              productName: selectedProduct?.name ?? "",
              batch: undefined,
              unit: selectedProduct?.unit ?? "OTHER",
              total: Math.round(data.price * data.quantity),
            });

            reset({
              productId: undefined,
              quantity: 1,
              price: 1,
              batch: undefined,
            });
          }
        }
      })}
    >
      <Form.Item
        className="flex-1"
        validateStatus={errors.productId ? "error" : ""}
        help={errors.productId?.message}
        label="Buscar Producto"
      >
        <Controller
          name="productId"
          control={control}
          defaultValue=""
          render={({ field }) => <ProductSelector {...field} />}
        />
      </Form.Item>

      <Form.Item
        className="w-36"
        validateStatus={errors.quantity ? "error" : ""}
        help={errors.quantity?.message}
        label="Cantidad"
      >
        <Controller
          name="quantity"
          control={control}
          defaultValue={1}
          render={({ field }) => (
            <InputNumber {...field} min={0.001} style={{ width: "100%" }} />
          )}
        />
      </Form.Item>
      <Form.Item
        className="w-80"
        validateStatus={errors.price ? "error" : ""}
        help={errors.price?.message}
        label="Precio"
      >
        <Controller
          name="price"
          control={control}
          defaultValue={1}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={0.001}
              style={{ width: "100%" }}
              parser={currencyParser}
              formatter={(value) => currencyFormatter(value)}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        className="w-80"
        validateStatus={errors.price ? "error" : ""}
        help={errors.price?.message}
        label="Total"
      >
        <InputNumber
          value={Math.round(getValues("price") * getValues("quantity"))}
          style={{ width: "100%" }}
          disabled
          parser={currencyParser}
          formatter={(value) => currencyFormatter(value)}
        />
      </Form.Item>
      <Form.Item className="flex flex-col justify-end w-fit">
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          icon={<PlusOutlined />}
        >
          Agregar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SaleItemForm;
