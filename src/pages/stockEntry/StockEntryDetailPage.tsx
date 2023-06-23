import React from "react";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Popconfirm,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { Link, useParams } from "react-router-dom";
import { StockMovement, StockMovementItem } from "../../api";
import {
  NumberText,
  PageContent,
  PageDetails,
  PageHeader,
  StatusTag,
} from "../../components";
import dayjs from "dayjs";
import {
  editStockMovements,
  getStockMovementsById,
} from "../../api/stockMovementRepository";
import { EditStockEntryFormModal } from "./EditStockEntryForm";

const StockEntryDetailPage: React.FC = () => {
  const { stockEntryId } = useParams();
  const queryClient = useQueryClient();

  const { data: result, isLoading } = useQuery({
    queryKey: ["stock_entry", stockEntryId],
    queryFn: () => {
      return getStockMovementsById(stockEntryId);
    },
  });

  const isRecipeActive = result?.status === "ACTIVE" ?? false;
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const columns: ColumnsType<StockMovementItem> = [
    {
      title: "Cantidad",
      dataIndex: "quantity",
      width: 80,
      key: "quantity",
      render: (_, row) => {
        return (
          <NumberText
            value={row.quantity}
            unit={row.productUnit}
            format="unit"
            position="right"
          />
        );
      },
    },
    {
      title: "Lote",
      dataIndex: "batch",
      key: "batch",
      width: 150,
      render: (_, row) => {
        return <span>{row.batch ? row.batch : "-"}</span>;
      },
    },
    {
      title: "Producto",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Precio",
      dataIndex: "price",
      width: 100,
      key: "price",
      render: (_, row) => {
        return (
          <NumberText value={row.price} format="currency" position="right" />
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 150,
      key: "total",
      render: (_, row) => {
        return (
          <NumberText value={row.total} format="currency" position="right" />
        );
      },
    },
  ];

  const disableStockMovement = (data: StockMovement) => {
    return editStockMovements(
      {
        date: data.date,
        entityId: data.entityId ?? "",
        status: isRecipeActive ? "INACTIVE" : "ACTIVE",
        documentNumber: data.documentNumber,
      },
      stockEntryId
    );
  };

  const { isPending, mutate } = useMutation({
    mutationFn: disableStockMovement,
    onSuccess: () => {
      message.success(
        `Entrada ${isRecipeActive ? "Desactivada" : "Activado"} correctamente`
      );
      queryClient.invalidateQueries({ queryKey: ["stock_entry"] });
    },
    onError: () => {
      message.error(
        `Error al ${isRecipeActive ? "Desactivar" : "Activar"}  la entrada`
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
            title: <Link to="/app/stock_entry">Entradas de Estoque</Link>,
          },
          {
            title: "Información de la Entrada",
          },
        ]}
        content={
          <div className="flex justify-between">
            <Typography.Title level={3}>
              {"Información de la Entrada"}
            </Typography.Title>

            <div className="flex gap-2">
              <Button icon={<EditOutlined />} onClick={showEditModal}>
                Editar
              </Button>

              {result && (
                <Popconfirm
                  placement="bottom"
                  title={
                    isRecipeActive ? "Desactivar Producto" : "Activar Producto"
                  }
                  description="¿Está seguro que desea cambiar el estado del producto?"
                  okText="Sí"
                  cancelText="No"
                  onConfirm={() => mutate(result)}
                >
                  <Button
                    type="primary"
                    danger={isRecipeActive}
                    loading={isPending}
                    icon={
                      isRecipeActive ? <DeleteOutlined /> : <CheckOutlined />
                    }
                  >
                    {isRecipeActive ? "Desactivar" : "Activar"}
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        }
      />
      <PageDetails>
        <Descriptions
          size="small"
          bordered
          column={1}
          style={{ background: "white", borderRadius: "8px" }}
        >
          <Descriptions.Item label="Estado">
            {result ? <StatusTag status={result?.status} /> : <></>}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha">
            <NumberText
              value={dayjs(result?.date).format("DD/MM/YYYY HH:mm:ss")}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Numero de Documento">
            {result?.documentNumber ?? "Sin Documento"}
          </Descriptions.Item>
          <Descriptions.Item label="Creado  por">
            {result?.createByUserName}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Cración">
            <NumberText
              value={dayjs(result?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Costo Total">
            <NumberText
              value={result?.total}
              format="currency"
              position="right"
            />
          </Descriptions.Item>
        </Descriptions>
      </PageDetails>
      <PageContent>
        <Table
          size="small"
          columns={columns}
          dataSource={result?.items}
          rowKey="id"
          pagination={false}
          className="mb-6"
        />
      </PageContent>
      <EditStockEntryFormModal
        stockEntryData={result}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
      />
    </>
  );
};

export default StockEntryDetailPage;
