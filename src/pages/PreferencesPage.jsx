import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Tag,
  Descriptions,
  Statistic,
  Row,
  Col,
  Button,
  Spin,
  Empty,
  Space,
  Divider,
  Progress,
} from 'antd'
import {
  ArrowLeftOutlined,
  UserOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { getPreference } from '../api/client'

const { Title, Text, Paragraph } = Typography

export default function PreferencesPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [pref, setPref] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPreference(userId || 'default')
      .then((res) => {
        if (res.code === 200) setPref(res.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" tip="加载用户偏好..." />
      </div>
    )
  }

  if (!pref || pref.total_trips === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 60 }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无用户偏好数据，请先进行一次行程规划"
        />
        <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
          去规划行程
        </Button>
      </div>
    )
  }

  // 排序标签
  const sortedTags = Object.entries(pref.preference_tags || {})
    .sort((a, b) => b[1] - a[1])

  const maxWeight = sortedTags.length > 0 ? sortedTags[0][1] : 1

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: 16 }}
      >
        返回首页
      </Button>

      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)',
          border: 'none',
        }}
      >
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Title level={3} style={{ marginBottom: 4 }}>
              <UserOutlined style={{ marginRight: 8 }} />
              用户偏好画像
            </Title>
            <Text type="secondary">用户 ID: {userId}</Text>
          </Col>
          <Col>
            <Statistic
              title="累计行程"
              value={pref.total_trips}
              suffix="次"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 兴趣标签 */}
      <Card title="兴趣标签" style={{ borderRadius: 12, marginBottom: 16 }}>
        {sortedTags.length === 0 ? (
          <Empty description="暂无标签" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sortedTags.map(([tag, weight]) => (
                <Tag
                  key={tag}
                  color={weight > 0.5 ? 'blue' : weight > 0.2 ? 'cyan' : 'default'}
                  style={{ fontSize: 14, padding: '4px 12px' }}
                >
                  <HeartOutlined /> {tag} ({weight.toFixed(2)})
                </Tag>
              ))}
            </div>
            {sortedTags.map(([tag, weight]) => (
              <div key={tag} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{tag}</Text>
                  <Text type="secondary">{(weight * 100).toFixed(0)}%</Text>
                </div>
                <Progress
                  percent={Math.round((weight / maxWeight) * 100)}
                  showInfo={false}
                  strokeColor={{ from: '#1677ff', to: '#722ed1' }}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 基本信息 */}
      <Card title="出行偏好" style={{ borderRadius: 12, marginBottom: 16 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="住宿偏好">
            {pref.preferred_hotel_level || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="交通偏好">
            {pref.preferred_transport || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="日均预算">
            <DollarOutlined /> {pref.avg_daily_budget?.toFixed(0) || 0} 元
          </Descriptions.Item>
          <Descriptions.Item label="最后更新">
            {pref.last_updated || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 去过的目的地 */}
      {pref.visited_destinations?.length > 0 && (
        <Card title="去过的目的地" style={{ borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {pref.visited_destinations.map((dest) => (
              <Tag key={dest} icon={<EnvironmentOutlined />} color="geekblue">
                {dest}
              </Tag>
            ))}
          </div>
        </Card>
      )}

      {/* 美食偏好 */}
      {pref.food_preferences?.length > 0 && (
        <Card title="美食偏好" style={{ borderRadius: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {pref.food_preferences.map((food) => (
              <Tag key={food} color="orange">{food}</Tag>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
