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
import { editStockMovements } from "../../../api/stockMovementRepository";
import dayjs from "dayjs";
import { saleSchema } from "../saleSchema";
interface ProductFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saleData?: StockMovement;
}

type CreateSalePayloadType = z.infer<typeof saleSchema>;

const EditSaleModal: React.FC<ProductFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  saleData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSalePayloadType>({
    resolver: zodResolver(saleSchema),
  });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();
  const isSaleActive = saleData?.status === "ACTIVE" ?? false;

  const editNewStockEntry = React.useCallback(
    (data: CreateSalePayloadType) => {
      return editStockMovements(
        {
          date: data.date,
          entityId: data.supplierId ?? "",
          documentNumber: data.documentNumber,
          status: isSaleActive ? "ACTIVE" : "INACTIVE",
        },
        saleData?.id
      );
    },
    [saleData]
  );
  const { isPending, mutate } = useMutation({
    mutationFn: editNewStockEntry,
    onSuccess: () => {
      message.success("Venta editada correctamente");
      queryClient.invalidateQueries({ queryKey: ["sale"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Error al editar el venta");
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
                defaultValue={saleData?.date}
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
                defaultValue={saleData?.documentNumber}
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
                defaultValue={saleData?.entityId}
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
              Editar Venta
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditSaleModal;
