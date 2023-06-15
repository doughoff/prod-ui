import {
  Button,
  Checkbox,
  Form,
  InputNumber,
  Modal,
  Radio,
  message,
} from "antd";
import React from "react";
import * as z from "zod";

import { Input } from "antd";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined } from "@ant-design/icons";
import { Product, Units, checkBarcode, editProduct } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormItemGroup } from "../../../components";
import { productSchema } from "../productSchema";
interface ProductFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productData?: Product;
}

type CreateProductPayloadType = z.infer<typeof productSchema>;

const EditProductFormModal: React.FC<ProductFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  productData,
}) => {
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateProductPayloadType>({
    resolver: zodResolver(productSchema),
  });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();
  const isProductActive = productData?.status === "ACTIVE" ?? false;

  const debounceTimer = React.useRef<number | null>(null);
  const validateUniqueBarcode = React.useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      checkBarcode(getValues("barcode"))
        .then((isRegistered) => {
          if (isRegistered && getValues("barcode") != productData?.barcode) {
            setError("barcode", {
              type: "manual",
              message: "El código de barras ya está en uso",
            });
          } else {
            clearErrors("barcode");
          }
        })
        .catch((err) => {
          if (err != false) {
            message.error("Error al validar el código de barras del producto");
          }
        });
    }, 300);
  }, []);
  const editNewProduct = React.useCallback(
    (data: CreateProductPayloadType) => {
      return editProduct(
        {
          name: data?.name,
          barcode: data?.barcode,
          batchControl: data?.hasBatch,
          conversionFactor: data?.conversionFactor,
          unit: data?.unit,
          status: isProductActive ? "ACTIVE" : "INACTIVE",
        },
        productData?.id
      );
    },
    [productData]
  );
  const { isPending, mutate } = useMutation({
    mutationFn: editNewProduct,
    onSuccess: () => {
      message.success("Producto editado correctamente");
      queryClient.invalidateQueries({ queryKey: ["product"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Error al editar el producto");
    },
  });

  return (
    <Modal
      title="Editar Producto"
      open={isModalOpen}
      width="42rem"
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit((data) => mutate(data))}>
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                defaultValue={productData?.name}
                render={({ field }) => (
                  <Input {...field} placeholder="Nombre" />
                )}
              />
            </Form.Item>
          }
          title="Nombre"
        />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.barcode ? "error" : ""}
              help={errors.barcode?.message}
            >
              <Controller
                name="barcode"
                control={control}
                defaultValue={productData?.barcode}
                render={({ field }) => (
                  <Input
                    {...field}
                    onKeyDown={() => {
                      setTimeout(() => validateUniqueBarcode());
                    }}
                    placeholder="Codigo de Barras"
                  />
                )}
              />
            </Form.Item>
          }
          title="Código de Barras"
        />

        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.unit ? "error" : ""}
              help={errors.unit?.message}
              extra="Unidad de medida del producto"
            >
              <Controller
                name="unit"
                control={control}
                defaultValue={productData?.unit}
                render={({ field }) => (
                  <Radio.Group {...field}>
                    <Radio.Button value={"UNIT" as Units}>Unidad</Radio.Button>
                    <Radio.Button value={"KG" as Units}>
                      Kilogramos
                    </Radio.Button>
                    <Radio.Button value={"L" as Units}>Litros</Radio.Button>
                    <Radio.Button value={"OTHER" as Units}>Otros</Radio.Button>
                  </Radio.Group>
                )}
              />
            </Form.Item>
          }
          title="Unidad"
        />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.conversionFactor ? "error" : ""}
              help={errors.conversionFactor?.message}
              extra="Ejemplo: 1 unidad = 30 kilogramos"
            >
              <Controller
                name="conversionFactor"
                control={control}
                defaultValue={productData?.conversionFactor}
                render={({ field }) => (
                  <InputNumber {...field} defaultValue={1} min={0.001} />
                )}
              />
            </Form.Item>
          }
          title="Factor de Conversión de Unidad"
        />
        <FormItemGroup
          inputs={
            <Form.Item>
              <Controller
                name="hasBatch"
                defaultValue={productData?.batchControl}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    ref={field.ref}
                    name={field.name}
                    onChange={field.onChange}
                    checked={field.value}
                  >
                    ¿Adicionar Control de lotes?
                  </Checkbox>
                )}
              />
            </Form.Item>
          }
          title="Configuraciones adicionales"
        />

        <Form.Item className="pt-3">
          <div className="flex justify-end">
            <Button
              className="mr-2"
              disabled={isPending}
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={isPending}
            >
              Editar Producto
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditProductFormModal;
