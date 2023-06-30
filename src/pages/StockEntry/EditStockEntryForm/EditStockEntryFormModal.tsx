import { Button, DatePicker, Divider, Form, Modal, message } from "antd";
import React from "react";
import * as z from "zod";

import { Input } from "antd";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined } from "@ant-design/icons";
import { StockMovement } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EntitySelector, FormItemGroup } from "../../../components";
import { stockEntrySchema } from "../stockEntrySchema";
import { editStockMovements } from "../../../api/stockMovementRepository";
import dayjs from "dayjs";
interface ProductFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stockEntryData?: StockMovement;
}

type CreateStockEntryPayloadType = z.infer<typeof stockEntrySchema>;

const EditStockEntryModal: React.FC<ProductFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  stockEntryData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStockEntryPayloadType>({
    resolver: zodResolver(stockEntrySchema),
  });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();
  const isProductActive = stockEntryData?.status === "ACTIVE" ?? false;

  const editNewStockEntry = React.useCallback(
    (data: CreateStockEntryPayloadType) => {
      return editStockMovements(
        {
          date: data.date,
          entityId: data.supplierId ?? "",
          documentNumber: data.documentNumber,
          status: isProductActive ? "ACTIVE" : "INACTIVE",
        },
        stockEntryData?.id
      );
    },
    [stockEntryData]
  );
  const { isPending, mutate } = useMutation({
    mutationFn: editNewStockEntry,
    onSuccess: () => {
      message.success("Entrada editada correctamente");
      queryClient.invalidateQueries({ queryKey: ["stock_entry"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Error al editar el producto");
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
                defaultValue={stockEntryData?.date}
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
                defaultValue={stockEntryData?.documentNumber}
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
                defaultValue={stockEntryData?.entityId}
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
              Editar Entrada
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditStockEntryModal;
