import { Button, Modal, message } from "antd";
import React from "react";
import * as z from "zod";

import { Divider, Form, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { userSchema } from "../userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined } from "@ant-design/icons";
import { User, checkEmail, editUser } from "../../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormItemGroup } from "../../../components";

interface UserFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData?: User;
}

const partialUserSchema = userSchema.pick({
  name: true,
  email: true,
  roles: true,
});
type PartialUserPayloadType = z.infer<typeof partialUserSchema>;

const EditUserFormModal: React.FC<UserFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  userData,
}) => {
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PartialUserPayloadType>({
    resolver: zodResolver(partialUserSchema),
  });
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();

  const debounceTimer = React.useRef<number | null>(null);
  const validateUniqueEmail = React.useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      checkEmail(getValues("email"))
        .then((isRegistered) => {
          if (isRegistered) {
            setError("email", {
              type: "manual",
              message: "El correo electrónico ya está en uso",
            });
          } else {
            clearErrors("email");
          }
        })
        .catch((err) => {
          if (err != false) {
            message.error("Error al validar el correo electrónico de usuario");
          }
        });
    }, 300);
  }, []);
  const editNewUser = React.useCallback((data: PartialUserPayloadType) => {
    return editUser(
      {
        name: data.name,
        email: data.email,
        password: "123456",
        roles: data.roles,
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
      title="Editar Usuario"
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
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input {...field} placeholder="Nombre" />
                )}
              />
            </Form.Item>
          }
          title="Nombre"
        />

        <Divider className="mt-0" />

        <FormItemGroup
          title="Correo Electrónico"
          inputs={
            <Form.Item
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Correo Electrónico"
                    onKeyDown={() => {
                      setTimeout(() => validateUniqueEmail());
                    }}
                  />
                )}
              />
            </Form.Item>
          }
        />
        <Divider className="mt-0" />
        <FormItemGroup
          inputs={
            <Form.Item
              validateStatus={errors.roles ? "error" : ""}
              help={errors.roles?.message}
            >
              <Controller
                name="roles"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Seleccionar los roles"
                    defaultValue={[]}
                    options={[
                      {
                        label: "Administrador",
                        value: "ADMIN",
                      },
                      {
                        label: "Operador",
                        value: "OPERATOR",
                      },
                    ]}
                    {...field}
                  />
                )}
              />
            </Form.Item>
          }
          title="Roles"
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
export default EditUserFormModal;
