import { useLocation, useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Tag,
  Timeline,
  Collapse,
  Statistic,
  Row,
  Col,
  Button,
  Empty,
  Descriptions,
  Alert,
  Space,
  Progress,
  Divider,
} from 'antd'
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CloudOutlined,
  CarOutlined,
  CoffeeOutlined,
  HomeOutlined,
  CameraOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

// 活动类型图标映射
const TYPE_ICON = {
  sightseeing: <CameraOutlined style={{ color: '#1677ff' }} />,
  dining: <CoffeeOutlined style={{ color: '#fa8c16' }} />,
  transport: <CarOutlined style={{ color: '#52c41a' }} />,
  hotel: <HomeOutlined style={{ color: '#722ed1' }} />,
  leisure: <EnvironmentOutlined style={{ color: '#eb2f96' }} />,
}

const TYPE_COLOR = {
  sightseeing: 'blue',
  dining: 'orange',
  transport: 'green',
  hotel: 'purple',
  leisure: 'magenta',
}

const TYPE_LABEL = {
  sightseeing: '景点',
  dining: '餐饮',
  transport: '交通',
  hotel: '住宿',
  leisure: '休闲',
}

export default function ResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const itinerary = state?.itinerary

  if (!itinerary) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Empty description="暂无行程数据" />
        <Button type="primary" onClick={() => navigate('/')}>
          返回规划
        </Button>
      </div>
    )
  }

  const totalCost = itinerary.estimated_cost || 0
  const breakdown = itinerary.budget_breakdown || {}
  const maxBreakdown = Math.max(...Object.values(breakdown), 1)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* 返回按钮 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: 16 }}
      >
        重新规划
      </Button>

      {/* 行程概览 */}
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #e6f7ff 0%, #f9f0ff 100%)',
          border: 'none',
        }}
      >
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Title level={3} style={{ marginBottom: 4 }}>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              {itinerary.destination} · {itinerary.total_days}天行程
            </Title>
            {itinerary.summary && (
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {itinerary.summary}
              </Paragraph>
            )}
          </Col>
          <Col>
            <Statistic
              title="预估总费用"
              value={totalCost}
              precision={0}
              suffix="元"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 预算明细 */}
      <Card
        title="预算明细"
        style={{ borderRadius: 12, marginBottom: 24 }}
        size="small"
      >
        <Row gutter={[16, 12]}>
          {Object.entries(breakdown).map(([label, amount]) => (
            <Col xs={24} sm={12} md={8} key={label}>
              <Text>{label}</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Progress
                  percent={Math.round((amount / maxBreakdown) * 100)}
                  showInfo={false}
                  style={{ flex: 1, margin: 0 }}
                />
                <Text strong>{amount.toFixed(0)} 元</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 每日行程 */}
      <Collapse
        defaultActiveKey={itinerary.daily_plans?.map((_, i) => String(i))}
        style={{ background: 'transparent', border: 'none' }}
      >
        {itinerary.daily_plans?.map((day, idx) => (
          <Panel
            key={String(idx)}
            header={
              <Space size="middle">
                <Tag color="blue" style={{ fontSize: 14, padding: '2px 10px' }}>
                  Day {day.day_number}
                </Tag>
                <Text strong>{day.date}</Text>
                {day.theme && <Text type="secondary">{day.theme}</Text>}
                {day.weather && (
                  <Tag icon={<CloudOutlined />} color="cyan">
                    {day.weather.day_weather} {day.weather.low_temp}~{day.weather.high_temp}℃
                  </Tag>
                )}
                <Tag color="gold">{day.daily_cost?.toFixed(0)} 元</Tag>
              </Space>
            }
            style={{
              background: '#fff',
              borderRadius: 12,
              marginBottom: 12,
              border: '1px solid #f0f0f0',
            }}
          >
            {/* 天气建议 */}
            {day.weather?.travel_advice && (
              <Alert
                message={day.weather.travel_advice}
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                style={{ marginBottom: 16 }}
              />
            )}

            {/* 活动时间线 */}
            <Timeline
              items={day.activities?.map((act) => ({
                dot: TYPE_ICON[act.type] || <ClockCircleOutlined />,
                children: (
                  <div className="activity-card" style={{ paddingBottom: 8 }}>
                    <Space wrap>
                      <Tag color={TYPE_COLOR[act.type]}>
                        {TYPE_LABEL[act.type] || act.type}
                      </Tag>
                      <Text strong style={{ fontSize: 15 }}>{act.name}</Text>
                      <Text type="secondary">
                        {act.start_time} - {act.end_time}
                      </Text>
                      {act.estimated_cost > 0 && (
                        <Tag color="volcano">{act.estimated_cost.toFixed(0)} 元</Tag>
                      )}
                    </Space>
                    {act.recommendation && (
                      <Paragraph
                        type="secondary"
                        style={{ margin: '4px 0 0 0', fontSize: 13 }}
                      >
                        {act.recommendation}
                      </Paragraph>
                    )}
                    {act.poi?.address && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <EnvironmentOutlined /> {act.poi.address}
                      </Text>
                    )}
                  </div>
                ),
              }))}
            />

            {/* 路线信息 */}
            {day.routes?.length > 0 && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  <CarOutlined /> 路线信息：
                </Text>
                <div style={{ marginTop: 8 }}>
                  {day.routes.map((route, ri) => (
                    <Tag key={ri} style={{ marginBottom: 4 }}>
                      {route.from_name} → {route.to_name}：
                      {(route.distance / 1000).toFixed(1)}km / {route.duration}分钟
                    </Tag>
                  ))}
                </div>
              </>
            )}
          </Panel>
        ))}
      </Collapse>

      {/* 旅行提示 */}
      {itinerary.tips?.length > 0 && (
        <Card
          title="旅行小贴士"
          size="small"
          style={{ borderRadius: 12, marginTop: 16 }}
        >
          {itinerary.tips.map((tip, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <Text>💡 {tip}</Text>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
