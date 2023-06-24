import React from "react";
import {
  NumberText,
  PageDetails,
  PageHeader,
  StatusTag,
} from "../../components";
import { Link, useParams } from "react-router-dom";
import { Entities, editEntities, getEntitieById } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Popconfirm,
  Spin,
  Typography,
  message,
} from "antd";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditSupplierForm } from "./EditSupplierForm";
import dayjs from "dayjs";

const SupplierDetailPage: React.FC = () => {
  const { supplierId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: () => getEntitieById(supplierId),
  });

  const isSupplierActive = data?.status === "ACTIVE" ?? false;

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const disableProduct = (data: Entities) => {
    return editEntities(
      {
        name: data.name,
        ci: data.ci,
        ruc: data.ruc,
        status: isSupplierActive ? "INACTIVE" : "ACTIVE",
      },
      supplierId
    );
  };

  const { isPending, mutate } = useMutation({
    mutationFn: disableProduct,
    onSuccess: () => {
      message.success(
        `Proveedor ${
          isSupplierActive ? "Desactivado" : "Activado"
        } correctamente`
      );
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
    },
    onError: () => {
      message.error(
        `Error al ${isSupplierActive ? "Desactivar" : "Activar"}  el Proveedor`
      );
    },
  });

  if (isLoading) {
    return (
      <div
        style={{
          height: "300px",
          margin: "20px 0",
          marginBottom: "20px",
          padding: "30px 50px",
          textAlign: "center",
        }}
      >
        <Spin tip="Cargando..."></Spin>
      </div>
    );
  }
  return (
    <>
      <PageHeader
        items={[
          {
            title: <Link to="/app">App</Link>,
          },
          {
            title: <Link to="/app/suppliers">Proveedor</Link>,
          },
          {
            title: `Información de ${data?.name}`,
          },
        ]}
        content={
          <div className="flex justify-between">
            <Typography.Title level={3}>
              {"Infromación de " + data?.name}
            </Typography.Title>
            <div className="flex gap-2">
              <Button icon={<EditOutlined />} onClick={showModal}>
                Editar
              </Button>
              {data && (
                <Popconfirm
                  placement="bottom"
                  title={
                    isSupplierActive
                      ? "Desactivar Proveedor"
                      : "Activar Proveedor"
                  }
                  description="¿Está seguro que desea cambiar el estado del proveedor?"
                  okText="Sí"
                  cancelText="No"
                  onConfirm={() => {
                    mutate(data);
                  }}
                >
                  <Button
                    type="primary"
                    loading={isPending}
                    danger={isSupplierActive}
                    icon={
                      isSupplierActive ? <DeleteOutlined /> : <CheckOutlined />
                    }
                  >
                    {isSupplierActive ? "Desactivar" : "Activar"}
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        }
      />
      <PageDetails>
        <Descriptions
          bordered
          column={1}
          size="small"
          style={{ background: "white", borderRadius: "8px" }}
        >
          <Descriptions.Item label="Fecha de Creación">
            <NumberText value={dayjs(data?.createdAt).format("DD/MM/YYYY")} />
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            {data ? <StatusTag status={data?.status} /> : <></>}
          </Descriptions.Item>
          <Descriptions.Item label="RUC">
            <NumberText value={data?.ruc} />
          </Descriptions.Item>
          <Descriptions.Item label="CI">
            <NumberText value={data?.ci} />
          </Descriptions.Item>
        </Descriptions>
      </PageDetails>
      <EditSupplierForm
        supplierData={data}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default SupplierDetailPage;
