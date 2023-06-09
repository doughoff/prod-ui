import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { getAllUser } from "../../utils";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card style={{ width: 420, padding: 24 }}>
        <Typography.Title level={4} style={{ marginBottom: "24px" }}>
          Iniciar Sesión
        </Typography.Title>

        <Form
          initialValues={{ remember: true }}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Correo Electronico"
            style={{ marginBottom: "12px" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            style={{ marginBottom: "12px" }}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Recuerdame</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: "0px" }}>
            <Button type="primary" htmlType="submit" onClick={getAllUser}>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
