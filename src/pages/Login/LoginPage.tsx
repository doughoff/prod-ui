import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Checkbox, Form, Input, Typography, message } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "../../api";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .min(1, { message: "El correo electrónico es requerido" })
    .email({
      message: "Correo electrónico no válido",
    }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(1, { message: "La contraseña es requerida" }),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  React.useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      navigate("/app");
    }
  }, []);
  React.useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe) {
      setValue("email", rememberMe);
      setValue("remember", true);
    }
  }, []);

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
          onFinish={handleSubmit((data) => {
            login(data.email, data.password)
              .then((res) => {
                if (data.remember) {
                  localStorage.setItem("rememberMe", data.email);
                }
                if (!data.remember) {
                  localStorage.removeItem("rememberMe");
                }
                console.log(res);
                setTimeout(() => {
                  navigate("/app");
                }, 50);
              })
              .catch((err) => {
                if (
                  err?.response?.data?.message == "invalid email or password"
                ) {
                  message.error("Email o Contrasena invalida");
                } else {
                  message.error("Error Inesperado");
                }
              });
          })}
        >
          <Form.Item
            label="Correo Eletrónico"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input prefix={<MailOutlined />} {...field} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password prefix={<LockOutlined />} {...field} />
              )}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} {...field}>
                  Recuerdame
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
