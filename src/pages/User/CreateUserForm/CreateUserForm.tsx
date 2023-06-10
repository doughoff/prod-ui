import React from "react";
import { FormItemGroup } from "../../../components";
import { Divider, Form, Input, Select } from "antd";
const CreateUserForm: React.FC = () => {
  return (
    <Form>
      <Form.Item>
        <Divider className="mt-0" />
        <FormItemGroup inputs={<Input placeholder="Nombre" />} title="Nombre" />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FormItemGroup
          inputs={<Input placeholder="Correo Electrónico" />}
          title="Correo Electrónico"
        />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FormItemGroup
          inputs={<Input.Password placeholder="Contraseña" />}
          title="Contraseña"
        />
      </Form.Item>
      <Divider />
      <Form.Item>
        <FormItemGroup
          inputs={<Input.Password placeholder="Confirmación de Contraseña" />}
          title="Confirmación de Contraseña"
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
        />
      </Form.Item>
      <Divider />
    </Form>
  );
};
export default CreateUserForm;
