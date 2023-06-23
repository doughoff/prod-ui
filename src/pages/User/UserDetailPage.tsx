import React from "react";
import {
  NumberText,
  PageDetails,
  PageHeader,
  RoleTag,
  StatusTag,
} from "../../components";
import { Link, useParams } from "react-router-dom";
import { User, editUser, getUserById } from "../../api";
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

  const { data, isLoading } = useQuery({
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

  const disableUser = (data: User) => {
    return editUser(
      {
        name: data?.name,
        email: "test1234@test.com",
        roles: data?.roles,
        status: isUserActive ? "INACTIVE" : "ACTIVE",
      },
      userId
    );
  };

  const { isPending, mutate } = useMutation({
    mutationFn: disableUser,
    onSuccess: () => {
      message.success(
        `Usario ${isUserActive ? "Desactivado" : "Activado"} correctamente`
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      message.error(
        `Error al ${isUserActive ? "Desactivar" : "Activar"}  usuario`
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
            title: <Link to="/app/users">Usuarios</Link>,
          },
          {
            title: `Información de ${data?.name}`,
          },
        ]}
        content={
          <div className="flex justify-between">
            <Typography.Title level={3}>
              {"Información de " + data?.name}
            </Typography.Title>
            <div className="flex gap-2">
              <Button icon={<EditOutlined />} onClick={showEditModal}>
                Editar
              </Button>
              <Button
                disabled
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
                    mutate(data);
                  }}
                >
                  <Button
                    loading={isPending}
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

      <PageDetails>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Nombre">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="Estado">
            {data ? <StatusTag status={data?.status} /> : <></>}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Creación">
            <NumberText value={dayjs(data?.createdAt).format("DD/MM/YYYY")} />
          </Descriptions.Item>
          <Descriptions.Item label="Correo Electronico">
            {data?.email}
          </Descriptions.Item>

          <Descriptions.Item label="Rol" span={2}>
            {userRoles(data)}
          </Descriptions.Item>
        </Descriptions>
      </PageDetails>
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
