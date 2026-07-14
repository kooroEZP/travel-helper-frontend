import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Select, Typography, Space, theme } from 'antd'
import {
  EnvironmentOutlined,
  HomeOutlined,
  UserOutlined,
  CompassOutlined,
} from '@ant-design/icons'
import { switchBackend } from '../api/client'
import { getUserId } from '../utils/cookie'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const BACKEND_OPTIONS = [
  { value: 'python', label: '🐍 Python (FastAPI · :8005)' },
  { value: 'java', label: '☕ Java (Spring Boot · :8080)' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)
  const [backend, setBackend] = useState('python')

  const handleBackendChange = (val) => {
    setBackend(val)
    switchBackend(val)
  }

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '行程规划' },
    { key: `/preferences/${getUserId()}`, icon: <UserOutlined />, label: '用户偏好' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Space
          align="center"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <CompassOutlined style={{ fontSize: 28, color: '#fff' }} />
          <Title level={4} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>
            AI Travel Helper
          </Title>
        </Space>

        <Select
          value={backend}
          onChange={handleBackendChange}
          options={BACKEND_OPTIONS}
          style={{ width: 220 }}
          size="middle"
        />
      </Header>

      <Layout>
        {/* 侧边导航 */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          width={200}
          style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ borderRight: 0, paddingTop: 8 }}
          />
        </Sider>

        {/* 主内容区 */}
        <Content
          style={{
            padding: 24,
            background: token.colorBgLayout,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
