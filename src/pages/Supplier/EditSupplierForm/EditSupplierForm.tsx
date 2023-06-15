import { Button, Form, Modal, message } from "antd";
import React from "react";
import * as z from "zod";
import { Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined } from "@ant-design/icons";
import { Entities, editEntities } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormItemGroup } from "../../../components";
import { supplierSchema } from "../supplierSchema";

interface ProductFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  supplierData?: Entities;
}

const supplierWithRUCOrCIValidation = supplierSchema.superRefine(
  (data, ctx) => {
    if (!data.RUC && !data.CI) {
      ctx.addIssue({
        code: "custom",
        path: ["RUC"],
        message: "Debe ingresar RUC o CI",
      });

      ctx.addIssue({
        code: "custom",
        path: ["CI"],
        message: "Debe ingresar RUC o CI",
      });
    }
  }
);
type CreateSupplierPayloadType = z.infer<typeof supplierWithRUCOrCIValidation>;

const EditProductFormModal: React.FC<ProductFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  supplierData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSupplierPayloadType>({
    resolver: zodResolver(supplierSchema),
  });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();
  const isProductActive = supplierData?.status === "ACTIVE" ?? false;

  const editNewSupplier = React.useCallback(
    (data: CreateSupplierPayloadType) => {
      return editEntities(
        {
          name: data?.name,
          ci: data.CI,
          ruc: data.RUC,
          status: isProductActive ? "ACTIVE" : "INACTIVE",
        },
        supplierData?.id
      );
    },
    [supplierData]
  );
  const { isPending, mutate } = useMutation({
    mutationFn: editNewSupplier,
    onSuccess: () => {
      message.success("Proveedor editado correctamente");
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Error al editar el proveedor");
    },
  });

  return (
    <Modal
      title="Editar Proveedor"
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
                defaultValue={supplierData?.name}
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
              validateStatus={errors.RUC ? "error" : ""}
              help={errors.RUC?.message}
            >
              <Controller
                name="RUC"
                control={control}
                defaultValue={supplierData?.ruc}
                render={({ field }) => <Input {...field} placeholder="RUC" />}
              />
            </Form.Item>
          }
          title="RUC"
        />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.CI ? "error" : ""}
              help={errors.CI?.message}
            >
              <Controller
                name="CI"
                control={control}
                defaultValue={supplierData?.ci}
                render={({ field }) => <Input {...field} placeholder="CI" />}
              />
            </Form.Item>
          }
          title="CI"
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
              Editar Proveedor
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditProductFormModal;
