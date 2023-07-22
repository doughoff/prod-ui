import { Button, DatePicker, Divider, Form, Modal, message } from "antd";
import React from "react";
import * as z from "zod";

import { Input } from "antd";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined } from "@ant-design/icons";
import { StockMovement } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editStockMovements } from "../../../api/stockMovementRepository";
import dayjs from "dayjs";
import { adjustSchema } from "../adjustSchema";
import { EntitySelector, FormItemGroup } from "../../../components";
interface ProductFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stockAdjustData?: StockMovement;
}

type CreateAdjustPayloadType = z.infer<typeof adjustSchema>;

const EditAdjustModal: React.FC<ProductFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  stockAdjustData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAdjustPayloadType>({
    resolver: zodResolver(adjustSchema),
  });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();
  const isAdjustActive = stockAdjustData?.status === "ACTIVE" ?? false;

  const editNewAdjust = React.useCallback(
    (data: CreateAdjustPayloadType) => {
      return editStockMovements(
        {
          date: data.date,
          entityId: data.supplierId ?? "",
          documentNumber: data.documentNumber,
          status: isAdjustActive ? "ACTIVE" : "INACTIVE",
        },
        stockAdjustData?.id
      );
    },
    [stockAdjustData]
  );
  const { isPending, mutate } = useMutation({
    mutationFn: editNewAdjust,
    onSuccess: () => {
      message.success("Ajuste editado correctamente");
      queryClient.invalidateQueries({ queryKey: ["adjust"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Error al editar el ajuste de estoque");
    },
  });

  return (
    <Modal
      title="Editar Entrada"
      open={isModalOpen}
      width="42rem"
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit((data) => mutate(data))}>
        <Divider className="mt-0" />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.date ? "error" : ""}
              help={errors.date?.message}
            >
              <Controller
                name="date"
                control={control}
                defaultValue={stockAdjustData?.date}
                render={({ field }) => (
                  <DatePicker
                    className="w-full"
                    name={field.name}
                    ref={field.ref}
                    value={
                      dayjs(field.value).isValid() ? dayjs(field.value) : null
                    }
                    onChange={(v) => {
                      if (v) {
                        field.onChange(v.toISOString());
                      } else {
                        field.onChange("");
                      }
                    }}
                  />
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
              validateStatus={errors.documentNumber ? "error" : ""}
              help={errors.documentNumber?.message}
            >
              <Controller
                name="documentNumber"
                control={control}
                defaultValue={stockAdjustData?.documentNumber}
                render={({ field }) => (
                  <Input placeholder="Numero de Documento" {...field} />
                )}
              />
            </Form.Item>
          }
          title="Código de Barras"
        />
        <Divider className="mt-0" />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.supplierId ? "error" : ""}
              help={errors.supplierId?.message}
              extra="Unidad de medida del producto"
            >
              <Controller
                name="supplierId"
                control={control}
                defaultValue={stockAdjustData?.entityId}
                render={({ field }) => (
                  <EntitySelector
                    placeholder="Selecciona un Proveedor"
                    {...field}
                  />
                )}
              />
            </Form.Item>
          }
          title="Unidad"
        />
        <Divider className="my-0" />
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
              Editar Ajuste
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditAdjustModal;
