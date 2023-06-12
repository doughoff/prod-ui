import { Button, Modal, message } from "antd";
import React from "react";
import * as z from "zod";

import { Divider, Form, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { userSchema } from "../userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined } from "@ant-design/icons";
import { User, editUser } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormItemGroup } from "../../../components";

interface UserFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData?: User;
}

const passwordUserSchema = userSchema
  .pick({
    password: true,
    passwordConfirmation: true,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });

type PasswordUserPayloadType = z.infer<typeof passwordUserSchema>;

const ResetUserPasswordFormModal: React.FC<UserFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  userData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordUserPayloadType>({
    resolver: zodResolver(passwordUserSchema),
  });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();

  const editNewUser = React.useCallback((data: PasswordUserPayloadType) => {
    return editUser(
      {
        name: userData ? userData?.name : "",
        email: userData ? userData?.email : "",
        password: data.password,
        roles: userData ? userData?.roles : [],
        status: userData ? userData?.status : "ACTIVE",
      },
      userData?.id
    );
  }, []);
  const { isPending, mutate } = useMutation({
    mutationFn: editNewUser,
    onSuccess: () => {
      message.success("Usuario editado correctamente");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error("Error al editar el usuario");
    },
  });

  return (
    <Modal
      title="Cambiar Constraseña"
      open={isModalOpen}
      width="39rem"
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleSubmit((data) => mutate(data))}>
        <Divider className="mt-0" />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.password ? "error" : ""}
              help={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Contraseña" />
                )}
              />
            </Form.Item>
          }
          title="Contraseña"
        />
        <Divider className="mt-0" />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.passwordConfirmation ? "error" : ""}
              help={errors.passwordConfirmation?.message}
            >
              <Controller
                name="passwordConfirmation"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Confirmación de Contraseña"
                  />
                )}
              />
            </Form.Item>
          }
          title="Confirmación de Contraseña"
        />
        <Divider className="mt-0" />

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
              Editar Usuario
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ResetUserPasswordFormModal;
