import React from "react";
import { PageHeader, RoleTag, StatusTag } from "../../components";
import { Link, useParams } from "react-router-dom";
import { User, editUser, getUserById } from "../../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Descriptions, Popconfirm, Typography, message } from "antd";
import dayjs from "dayjs";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { EditUserFormModal } from "./EditUserForm";
import { ResetUserPasswordFormModal } from "./ResetUserPasswordForm";

const UserDetailPage: React.FC = () => {
  const { userId } = useParams();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });

  const userRoles = (user: User | undefined): React.ReactNode => {
    const tags = user?.roles.map((role) => <RoleTag key={role} role={role} />);
    if (tags?.length === 0) {
      return <span>Sin Roles</span>;
    }
    return tags;
  };
  const isUserActive = data?.status === "ACTIVE" ?? false;

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const [isResetPasswordOpen, setIsResetPasswordOpen] = React.useState(false);

  const showResetPasswordModal = () => {
    setIsResetPasswordOpen(true);
  };

  return (
    <>
      <PageHeader
        items={[
          {
            title: <Link to="/app">App</Link>,
          },
          {
            title: <Link to="/app/users">Usuarios</Link>,
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
              <Button icon={<EditOutlined />} onClick={showEditModal}>
                Editar
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={showResetPasswordModal}
              >
                Cambiar Contraseña
              </Button>
              {data && (
                <Popconfirm
                  placement="bottom"
                  title={
                    isUserActive ? "Desactivar Usuario" : "Activar Usuario"
                  }
                  description="¿Está seguro que desea cambiar el estado del usuario?"
                  okText="Sí"
                  cancelText="No"
                  onConfirm={() => {
                    editUser(
                      {
                        name: data?.name,
                        email: "test1234@test.com",
                        roles: data?.roles,
                        status: isUserActive ? "INACTIVE" : "ACTIVE",
                      },
                      data.id
                    )
                      .then(() => {
                        message.info("Usuario actualizado correctamente");
                      })
                      .catch(() => {
                        message.error("Error al actualizar el usuario");
                      })
                      .finally(() => {
                        queryClient.invalidateQueries({ queryKey: ["user"] });
                      });
                  }}
                >
                  <Button
                    type="primary"
                    danger={isUserActive}
                    icon={isUserActive ? <DeleteOutlined /> : <CheckOutlined />}
                  >
                    {isUserActive ? "Desactivar" : "Activar"}
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
          <Descriptions.Item label="Fecha de Creación">
            {dayjs(data?.createdAt).format("DD/MM/YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Correo Electronico">
            {data?.email}
          </Descriptions.Item>

          <Descriptions.Item label="Rol" span={2}>
            {userRoles(data)}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <EditUserFormModal
        userData={data}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
      />
      <ResetUserPasswordFormModal
        userData={data}
        isModalOpen={isResetPasswordOpen}
        setIsModalOpen={setIsResetPasswordOpen}
      />
    </>
  );
};

export default UserDetailPage;
