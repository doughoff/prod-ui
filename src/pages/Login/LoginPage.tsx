import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import React from "react";
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { login } from '../../api';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


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
          onFinish={handleSubmit(data => {
            // aqui chama a função login
            // salva no localStorage email caso a pessoa marcou o remember
            if (data.remember) {
              // salva email no localstorage pra carregar automatico proxima vez
            }

            // chama login
            login(data.email, data.password).then(res => {
              //aqui foi success mandar pra home
              console.log(res)
            }).catch((err) => {
              // aqui deu erro
              // pesquisar como fazer o cast to AxiosError pra checar o err.response.data.message
              // mostrat Toast > Email/Contrasena invalida
              console.error(err)
            })
          })}
        >
          <Form.Item
            label="Correo Eletrónico"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => <Input prefix={<MailOutlined />} {...field} />}
            ></Controller>
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message?.toString()}
          >
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => <Input.Password prefix={<LockOutlined />} {...field} />}
            ></Controller>
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => <Checkbox  {...field} />}
            ></Controller>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div >
  );
};

export default LoginPage;
