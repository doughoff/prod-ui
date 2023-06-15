import React from "react";
import { PageHeader, StatusTag } from "../../components";
import { Link, useParams } from "react-router-dom";
import { editEntities, getEntitieById } from "../../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Descriptions, Popconfirm, Typography, message } from "antd";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditSupplierForm } from "./EditSupplierForm";

const SupplierDetailPage: React.FC = () => {
  const { supplierId } = useParams();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: () => getEntitieById(supplierId),
  });

  const isSupplierActive = data?.status === "ACTIVE" ?? false;

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

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
                    editEntities(
                      {
                        name: data?.name,
                        ruc: data?.ruc,
                        ci: data.ci,
                        status: isSupplierActive ? "INACTIVE" : "ACTIVE",
                      },
                      data.id
                    )
                      .then(() => {
                        message.info("Producto actualizado correctamente");
                      })
                      .catch(() => {
                        message.error("Error al actualizar el producto");
                      })
                      .finally(() => {
                        queryClient.invalidateQueries({
                          queryKey: ["supplier"],
                        });
                      });
                  }}
                >
                  <Button
                    type="primary"
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
      <div className="px-6">
        <Descriptions
          bordered
          column={1}
          style={{ background: "white", borderRadius: "8px" }}
        >
          <Descriptions.Item label="Nombre">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="Estado">
            {data ? <StatusTag status={data?.status} /> : <></>}
          </Descriptions.Item>
          <Descriptions.Item label="RUC">{data?.ruc}</Descriptions.Item>
          <Descriptions.Item label="CI">{data?.ci}</Descriptions.Item>
        </Descriptions>
      </div>
      <EditSupplierForm
        supplierData={data}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default SupplierDetailPage;
