import * as z from "zod";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  message,
} from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FormItemGroup } from "../../../components";
import { Units } from "../../../api";
import { productSchema } from "../productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, checkBarcode } from "../../../api/productRepository";
import TextArea from "antd/es/input/TextArea";
import { CheckOutlined } from "@ant-design/icons";

interface ProductFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
type CreateProductPayloadType = z.infer<typeof productSchema>;

const CreateProductFormModal: React.FC<ProductFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useForm<CreateProductPayloadType>({
    resolver: zodResolver(productSchema),
  });
  const debounceTimer = React.useRef<number | null>(null);
  const validateUniqueBarcode = React.useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      checkBarcode(getValues("barcode"))
        .then((isRegistered) => {
          if (isRegistered) {
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
  const createNewProduct = React.useCallback(
    (data: CreateProductPayloadType) => {
      return createProduct({
        name: data.name,
        barcode: data.barcode,
        conversionFactor: data.conversionFactor,
        batchControl: data.hasBatch,
        unit: data.unit,
        description: data.description ? data.description : undefined,
      });
    },
    []
  );

  const { isPending, mutate } = useMutation({
    mutationFn: createNewProduct,
    onSuccess: () => {
      message.success("Producto creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Error al crear   producto");
    },
  });
  return (
    <Modal
      title="Crear Nuevo Producto"
      open={isModalOpen}
      width="42rem"
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
                defaultValue=""
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
                defaultValue=""
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
              validateStatus={errors.description ? "error" : ""}
              help={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextArea
                    {...field}
                    showCount
                    maxLength={200}
                    placeholder="Descripción"
                  />
                )}
              />
            </Form.Item>
          }
          title="Descripción"
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
                defaultValue={"UNIT"}
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
                defaultValue={1}
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
                defaultValue={false}
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
              Crear Producto
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateProductFormModal;
