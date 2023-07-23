import React from "react";
import * as z from "zod";
import {
  EntitySelector,
  NumberText,
  PageContent,
  PageDetails,
  PageHeader,
} from "../../components";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Table,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createStockMovement } from "../../api/stockMovementRepository";
import { SaleItems, saleSchema } from "./saleSchema";
import SaleItemForm from "./components/StockItemForm";

type CreateSalePayloadType = z.infer<typeof saleSchema>;

const CreateSalePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = React.useRef<any>();
  const navigate = useNavigate();
  const [items, setItems] = React.useState<SaleItems[]>([]);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CreateSalePayloadType>({
    resolver: zodResolver(saleSchema),
  });

  const removeItem = (data: SaleItems) => {
    const filtered = items.filter(
      (i) =>
        i.productId != data.productId ||
        i.price != data.price ||
        i.batch != data.batch
    );
    setItems(filtered);
  };

  const createNewSale = React.useCallback(
    (data: CreateSalePayloadType) => {
      return createStockMovement({
        type: "SALE",
        date: data.date,
        documentNumber: data?.documentNumber ?? undefined,
        entityId: getValues("supplierId"),
        items: items.map((i) => {
          return {
            productId: i.productId,
            quantity: i.quantity,
            batch: i?.batch,
            price: i.price,
          };
        }),
      });
    },
    [items]
  );

  const { isPending, mutate } = useMutation({
    mutationFn: createNewSale,
    onSuccess: () => {
      message.success("Venta Registrada");
      navigate("/app/sales");
    },
    onError: () => {
      message.error("Error al registrar la entrada");
    },
  });

  return (
    <>
      <PageHeader
        items={[
          {
            title: <Link to="/app">App</Link>,
          },
          {
            title: <Link to="/app/sales">Ventas</Link>,
          },
          {
            title: "Nueva Venta",
          },
        ]}
        content={
          <div className="flex justify-between">
            <Typography.Title level={3}>Nueva Venta</Typography.Title>
            <Button
              icon={<ShoppingCartOutlined />}
              type="primary"
              onClick={() => {
                formRef.current.submit();
              }}
              loading={isPending}
            >
              Concluir
            </Button>
          </div>
        }
      />
      <PageDetails>
        <Form
          ref={formRef}
          onFinish={handleSubmit((data) => {
            if (items.length > 0) {
              return mutate(data);
            } else {
              console.log(data);
              message.error("La entrada debe tener algun item");
            }
          })}
        >
          <Descriptions
            size="small"
            bordered
            column={2}
            style={{ background: "white", borderRadius: "8px" }}
          >
            <Descriptions.Item
              label="Fecha de Entrada"
              labelStyle={{
                fontWeight: "bold",
              }}
              contentStyle={{
                padding: "1.5rem 1rem  0 1rem",
              }}
            >
              <Form.Item
                validateStatus={errors.supplierId ? "error" : ""}
                help={errors.supplierId?.message}
              >
                <Controller
                  name="date"
                  control={control}
                  defaultValue=""
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
            </Descriptions.Item>
            <Descriptions.Item
              label="Numero de Documento"
              contentStyle={{
                padding: "1.5rem 1rem  0 1rem",
              }}
              labelStyle={{
                fontWeight: "bold",
              }}
            >
              <Form.Item
                validateStatus={errors.documentNumber ? "error" : ""}
                help={errors.documentNumber?.message}
              >
                <Controller
                  name="documentNumber"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Numero de Documento" {...field} />
                  )}
                />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item
              label="Buscar proveedor"
              contentStyle={{
                padding: "1.5rem 1rem  0 1rem",
              }}
              labelStyle={{
                fontWeight: "bold",
              }}
            >
              <Form.Item
                validateStatus={errors.date ? "error" : ""}
                help={errors.date?.message}
              >
                <Controller
                  name="supplierId"
                  control={control}
                  render={({ field }) => (
                    <EntitySelector
                      placeholder="Selecciona un Proveedor"
                      {...field}
                    />
                  )}
                />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
        </Form>
      </PageDetails>

      <PageContent>
        <Typography.Title level={4}>Items</Typography.Title>
        <SaleItemForm items={items} setItems={setItems} />
        <Table
          columns={[
            {
              title: "Cantidad",
              dataIndex: "quantity",
              key: "quantity",
              width: 100,
              render: (_, row) => {
                return (
                  <NumberText
                    value={row.quantity}
                    format="unit"
                    position="right"
                  />
                );
              },
            },
            {
              title: "Lote",
              dataIndex: "batch",
              key: `batch`,
              width: 150,
            },
            {
              title: "Producto",
              dataIndex: "productName",
              key: `productName`,
            },

            {
              title: "Precio unitario",
              dataIndex: "price",
              align: "right",
              key: "price",
              width: 100,
              render: (_, row) => {
                return (
                  <NumberText
                    value={row.price}
                    format="currency"
                    position="right"
                  />
                );
              },
            },
            {
              title: "Total",
              dataIndex: "total",
              align: "right",
              key: "total",
              width: 150,
              render: (_, row) => {
                return (
                  <NumberText
                    value={row.total}
                    format="currency"
                    position="right"
                  />
                );
              },
            },
            {
              title: "Acciones",
              key: "actions",
              dataIndex: "actions",
              width: 100,
              render: (_, row) => (
                <div className="flex flex-row-reverse pr-1">
                  <Button
                    danger
                    onClick={() => {
                      removeItem(row);
                    }}
                    icon={<DeleteOutlined />}
                  />
                </div>
              ),
            },
          ]}
          dataSource={items}
          pagination={false}
          size="small"
        />
      </PageContent>
    </>
  );
};

export default CreateSalePage;
