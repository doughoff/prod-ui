import { Button, Modal, message } from "antd";
import React from "react";
import * as z from "zod";

import { Divider, Form, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined } from "@ant-design/icons";
import { createEntities } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormItemGroup } from "../../../components";
import { supplierSchema } from "../supplierSchema";

interface SupplierFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

const CreateSupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const {
    control,
    handleSubmit,

    reset,
    formState: { errors },
  } = useForm<CreateSupplierPayloadType>({
    resolver: zodResolver(supplierWithRUCOrCIValidation),
  });
  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const queryClient = useQueryClient();

  const createNewSupplier = React.useCallback(
    (data: CreateSupplierPayloadType) => {
      return createEntities({
        name: data.name,
        ci: data?.CI,
        ruc: data?.RUC,
      });
    },
    []
  );
  const { isPending, mutate } = useMutation({
    mutationFn: createNewSupplier,
    onSuccess: () => {
      message.success("Proveedor creado correctamente");
      reset();
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      message.error(`${err}`);
    },
  });

  return (
    <Modal
      title="Crear Nuevo Proveedor"
      open={isModalOpen}
      width="39rem"
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleSubmit((data) => mutate(data))}>
        <Divider className="mt-0" />
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
        <Divider className="mt-0" />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.RUC ? "error" : ""}
              help={errors.RUC?.message}
            >
              <Controller
                name="RUC"
                control={control}
                defaultValue=""
                render={({ field }) => <Input {...field} placeholder="RUC" />}
              />
            </Form.Item>
          }
          title="RUC"
        />
        <Divider className="mt-0" />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.CI ? "error" : ""}
              help={errors.CI?.message}
            >
              <Controller
                name="CI"
                control={control}
                defaultValue=""
                render={({ field }) => <Input {...field} placeholder="CI" />}
              />
            </Form.Item>
          }
          title="Cedula de Identidad"
        />

        <Divider className="mt-0" />
        <Form.Item className="pt-3">
          <div className="flex justify-end">
            <Button
              className="mr-2"
              disabled={isPending}
              onClick={() => {
                reset();
                setIsModalOpen(false);
              }}
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
export default CreateSupplierFormModal;
