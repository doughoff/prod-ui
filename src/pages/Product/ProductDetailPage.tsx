import React from "react";
import {
  NumberText,
  PageDetails,
  PageHeader,
  StatusTag,
  UnitTag,
} from "../../components";
import { Link, useParams } from "react-router-dom";
import { editProduct, getProductById } from "../../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Descriptions, Popconfirm, Typography, message } from "antd";
import dayjs from "dayjs";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditProductFormModal } from "./EditProductForm";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
  });

  const isProductActive = data?.status === "ACTIVE" ?? false;

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
            title: <Link to="/app/products">Productos</Link>,
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
                    isProductActive ? "Desactivar Producto" : "Activar Producto"
                  }
                  description="¿Está seguro que desea cambiar el estado del producto?"
                  okText="Sí"
                  cancelText="No"
                  onConfirm={() => {
                    editProduct(
                      {
                        name: data?.name,
                        barcode: data?.barcode,
                        batchControl: data?.batchControl,
                        conversionFactor: data?.conversionFactor,
                        unit: data?.unit,
                        status: isProductActive ? "INACTIVE" : "ACTIVE",
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
                          queryKey: ["producto"],
                        });
                      });
                  }}
                >
                  <Button
                    type="primary"
                    danger={isProductActive}
                    icon={
                      isProductActive ? <DeleteOutlined /> : <CheckOutlined />
                    }
                  >
                    {isProductActive ? "Desactivar" : "Activar"}
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
          size="small"
          column={1}
          style={{ background: "white", borderRadius: "8px" }}
        >
          <Descriptions.Item label="Nombre">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="Codigo de Barra">
            <NumberText value={data?.barcode} />
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            {data ? <StatusTag status={data?.status} /> : <></>}
          </Descriptions.Item>
          <Descriptions.Item label="Cantidad">
            <NumberText
              value={data?.stock}
              format="unit"
              unit={data?.unit}
              position="right"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Precio Promedio">
            <NumberText
              value={data?.averageCost}
              format="currency"
              position="right"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Creación">
            <NumberText value={dayjs(data?.createdAt).format("DD/MM/YYYY")} />
          </Descriptions.Item>
          <Descriptions.Item label="Unidad">
            {data ? <UnitTag unit={data?.unit} /> : <></>}
          </Descriptions.Item>
        </Descriptions>
      </PageDetails>
      <EditProductFormModal
        productData={data}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default ProductDetailPage;
