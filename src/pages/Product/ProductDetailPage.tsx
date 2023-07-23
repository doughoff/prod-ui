import React from "react";
import {
  NumberText,
  PageDetails,
  PageHeader,
  StatusTag,
  UnitTag,
} from "../../components";
import { Link, useParams } from "react-router-dom";
import { Product, editProduct, getProductById } from "../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Popconfirm,
  Spin,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditProductFormModal } from "./EditProductForm";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
  });

  const isProductActive = data?.status === "ACTIVE" ?? false;

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const disableProduct = (data: Product) => {
    return editProduct(
      {
        name: data.name,
        barcode: data.barcode,
        conversionFactor: data.conversionFactor,
        batchControl: data.batchControl,
        unit: data.unit,
        status: isProductActive ? "INACTIVE" : "ACTIVE",
      },
      productId
    );
  };

  const { isPending, mutate } = useMutation({
    mutationFn: disableProduct,
    onSuccess: () => {
      message.success(
        `Producto ${isProductActive ? "Desactivado" : "Activado"} correctamente`
      );
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: () => {
      message.error(
        `Error al ${isProductActive ? "Desactivar" : "Activar"}  el producto`
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
                    mutate(data);
                  }}
                >
                  <Button
                    type="primary"
                    loading={isPending}
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
          <Descriptions.Item label="Factor de Conversión">
            <NumberText value={data?.conversionFactor} />
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
