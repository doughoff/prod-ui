import React from "react";
import { FormItemGroup } from "../../components";
import { Divider, Form, Input, Select } from "antd";

export const CreateUserForm: React.FC = () => {
  return (
    <Form>
      <Form.Item>
        <FormItemGroup
          inputs={<Input placeholder="Nombre" />}
          title="Nombre"
          description="Description"
        />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FormItemGroup
          inputs={<Input placeholder="Correo Electrónico" />}
          title="Correo Electrónico"
          description="Description"
        />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FormItemGroup
          inputs={<Input.Password placeholder="Contraseña" />}
          title="Contraseña"
          description="Description"
        />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FormItemGroup
          inputs={<Input.Password placeholder="Confirmación de Contraseña" />}
          title="Confirmación de Contraseña"
          description="Description"
        />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FormItemGroup
          inputs={
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
            />
          }
          title="Roles"
          description="Description"
        />
      </Form.Item>
      <Divider />
    </Form>
  );
};
