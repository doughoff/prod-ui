import { Button, Layout, Menu } from 'antd'
import React from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

const { Sider } = Layout

const SideBarMenu: React.FunctionComponent<{
  routes: Array<{
    path: string
    label: JSX.Element
    icon: JSX.Element
  }>
}> = ({ routes }) => {
  const [sideMenuCollapsed, setSideMenuCollapsed] =
    React.useState<boolean>(true)

  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = React.useMemo(() => {
    // should get first part of the current path (from react-router-dom)
    // ex: /admin/users -> 'admin'
    return location.pathname.split('/')[2] ?? location.pathname
  }, [location])

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={sideMenuCollapsed}
      theme='light'
      style={{ borderInlineEnd: '1px solid rgba(5, 5, 5, 0.06)' }}
    >
      <Menu
        theme='light'
        mode='inline'
        style={{ minHeight: 'calc(100% - 64px)' }}
        defaultSelectedKeys={[currentPath]}
        selectedKeys={[currentPath]}
        items={routes.map((route) => ({
          key: route.path.split('/')[2] ?? route.path,
          label: route.label,
          icon: route.icon,
          onClick: () => {
            // should navigate to the route path
            navigate(route.path)
          }
        }))}
      />
      <Button
        type='text'
        icon={sideMenuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => {
          setSideMenuCollapsed(!sideMenuCollapsed)
        }}
        style={{
          fontSize: '16px',
          width: '100%',
          height: 64
        }}
      />
    </Sider>
  )
}

export default SideBarMenu
