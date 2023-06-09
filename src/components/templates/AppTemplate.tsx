import React from 'react'
import {
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  BarcodeOutlined,
  ShopOutlined,
  CaretUpFilled,
  CaretDownOutlined,
  LoginOutlined,
  ExperimentOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import {
  Layout,
  Button,
  theme,
  Dropdown,
  Menu,
  Breadcrumb,
  Typography
} from 'antd'

import { Outlet, useNavigate, Link } from 'react-router-dom'

import './AppTemplate.module.css'
import { SideBarMenu } from '../organisms/SideBarMenu'

const { Header, Content } = Layout

const AppTemplate: React.FC = () => {
  const navigate = useNavigate()

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        style={{
          padding: '0 24px 24px',
          background: '#18181b',
          color: 'white'
        }}
      >
        <div className='flex flex-row justify-between'>
          <span>
            <strong>HK</strong> | Productions
          </span>

          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <Menu
                      expandIcon={({ isOpen }) =>
                        isOpen ? <CaretUpFilled /> : <CaretDownOutlined />
                      }
                      style={{ width: 256, border: 'none' }}
                      mode='inline'
                      items={[
                        {
                          label: (
                            <div className='flex flex-col'>
                              <span className='text-black'>John</span>
                              <span>email@email.com</span>
                            </div>
                          ),
                          key: '0',
                          type: 'group'
                        },
                        {
                          key: '1',
                          type: 'divider'
                        },
                        {
                          label: 'Perfil',
                          key: '2',
                          icon: <UserOutlined />,
                          onClick: () => {
                            navigate('/')
                          }
                        },
                        {
                          key: '4',
                          type: 'divider'
                        },
                        {
                          label: 'Cerrar Sesión',
                          key: '5',
                          icon: <LogoutOutlined />,
                          onClick: () => {
                            navigate('/login')
                          },
                          danger: true
                        }
                      ]}
                    />
                  ),
                  key: '0',
                  type: 'group'
                }
              ],
              style: { minWidth: '256px' }
            }}
            trigger={['click']}
          >
            <Button
              type='text'
              style={{
                width: 64,
                height: 64,
                border: 'none'
              }}
            >
              <UserOutlined style={{ color: 'white' }} />
            </Button>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <SideBarMenu
          routes={[
            {
              path: '/app',
              icon: <HomeOutlined />,
              label: <Link to='/app'>App</Link>
            },
            {
              path: '/app/users',
              icon: <UserOutlined />,
              label: <Link to='/app/users'>Usuario</Link>
            },
            {
              path: '/app/products',
              icon: <BarcodeOutlined />,
              label: <Link to='/app/products'>Productos</Link>
            },
            {
              path: '/app/suppliers',
              icon: <ShopOutlined />,
              label: <Link to='/app/suppliers'>Proveedores</Link>
            },
            {
              path: '/app/stock_entry',
              icon: <LoginOutlined />,
              label: <Link to='/app/stock_entry'>Entrada de Estoque</Link>
            },
            {
              path: '/app/recipes',
              icon: <ExperimentOutlined />,
              label: <Link to='/app/recipes'>Formulas</Link>
            },
            {
              path: '/app/production_orders',
              icon: <UnorderedListOutlined />,
              label: (
                <Link to='/app/production_orders'>Orden de Produciones</Link>
              )
            }
          ]}
        />
        <Layout>
          <Content
            style={{
              background: colorBgContainer
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppTemplate
