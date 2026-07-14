import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  DatePicker,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  message,
  Spin,
} from 'antd'
import {
  SendOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { planTrip, planTripStructured } from '../api/client'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const PREFERENCE_TAGS = [
  '文化', '美食', '自然', '亲子', '购物',
  '摄影', '历史', '夜生活', '冒险', '休闲',
]

const HOTEL_LEVELS = [
  { value: '经济型', label: '经济型 (≤200元/晚)' },
  { value: '舒适型', label: '舒适型 (200-500元/晚)' },
  { value: '豪华型', label: '豪华型 (500+元/晚)' },
]

const TRANSPORT_MODES = [
  { value: '公交', label: '公共交通' },
  { value: '打车', label: '打车/网约车' },
  { value: '自驾', label: '自驾' },
  { value: '步行', label: '步行为主' },
]

const EXAMPLE_PROMPTS = [
  '我想去成都玩3天，预算3000元，喜欢吃美食和看古迹',
  '周末带家人去杭州西湖玩2天，预算5000，亲子游',
  '去西安玩4天，主要想看历史遗迹，预算4000元',
  '和朋友去厦门拍照3天，预算2500，喜欢摄影和美食',
]

export default function HomePage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [mode, setMode] = useState('natural') // natural | structured
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])

  const handleNaturalSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const result = await planTrip(values.input)
      if (result.code === 200) {
        navigate('/result', { state: { itinerary: result.data } })
      } else {
        message.error(result.message || '规划失败')
      }
    } catch (err) {
      message.error(err?.response?.data?.detail || err.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }

  const handleStructuredSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload = {
        destination: values.destination,
        origin: values.origin || '',
        days: values.days || 3,
        budget: values.budget || 5000,
        preferences: selectedTags,
        travelers: values.travelers || 1,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        hotelLevel: values.hotelLevel || '舒适型',
        transportMode: values.transportMode || '公交',
      }
      const result = await planTripStructured(payload)
      if (result.code === 200) {
        navigate('/result', { state: { itinerary: result.data } })
      } else {
        message.error(result.message || '规划失败')
      }
    } catch (err) {
      message.error(err?.response?.data?.detail || err.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* 头部 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          <EnvironmentOutlined style={{ marginRight: 8, color: '#1677ff' }} />
          智能行程规划
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          基于 AI 大模型 + 实时天气/地图数据，为您定制完美旅行计划
        </Paragraph>
      </div>

      {/* 模式切换 */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Space>
          <Button
            type={mode === 'natural' ? 'primary' : 'default'}
            onClick={() => { setMode('natural'); form.resetFields() }}
          >
            自然语言输入
          </Button>
          <Button
            type={mode === 'structured' ? 'primary' : 'default'}
            onClick={() => { setMode('structured'); form.resetFields(); setSelectedTags([]) }}
          >
            结构化表单
          </Button>
        </Space>
      </div>

      {/* 表单 */}
      <Card
        style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        bodyStyle={{ padding: 32 }}
      >
        <Spin spinning={loading} tip="AI 正在规划行程..." size="large">
          <Form
            form={form}
            layout="vertical"
            initialValues={{ days: 3, budget: 5000, travelers: 1 }}
          >
            {mode === 'natural' ? (
              <>
                <Form.Item
                  label="描述您的旅行计划"
                  name="input"
                  rules={[{ required: true, message: '请描述您的旅行需求' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="例如：我想去成都玩3天，预算3000元，喜欢吃美食和看古迹"
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
                {/* 示例提示 */}
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">试试这些：</Text>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {EXAMPLE_PROMPTS.map((p, i) => (
                      <Tag
                        key={i}
                        color="blue"
                        style={{ cursor: 'pointer', padding: '4px 8px' }}
                        onClick={() => form.setFieldsValue({ input: p })}
                      >
                        {p}
                      </Tag>
                    ))}
                  </div>
                </div>
                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  block
                  onClick={handleNaturalSubmit}
                  loading={loading}
                >
                  开始规划
                </Button>
              </>
            ) : (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="出行人数" name="travelers">
                      <InputNumber min={1} max={20} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="目的地"
                      name="destination"
                      rules={[{ required: true, message: '请输入目的地' }]}
                    >
                      <Input prefix={<EnvironmentOutlined />} placeholder="如：成都" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="出发地" name="origin">
                      <Input prefix={<EnvironmentOutlined />} placeholder="如：北京（可选）" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="天数" name="days">
                      <InputNumber min={1} max={30} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="预算（元）" name="budget">
                      <InputNumber min={100} step={500} style={{ width: '100%' }} prefix={<DollarOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="出发日期" name="startDate">
                      <DatePicker style={{ width: '100%' }} disabledDate={(d) => d.isBefore(dayjs().startOf('day'))} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="住宿偏好" name="hotelLevel">
                      <Select options={HOTEL_LEVELS} placeholder="选择住宿等级" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="交通方式" name="transportMode">
                      <Select options={TRANSPORT_MODES} placeholder="选择交通方式" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="出行偏好">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {PREFERENCE_TAGS.map((tag) => {
                      const selected = selectedTags.includes(tag)
                      return (
                        <Tag
                          key={tag}
                          color={selected ? 'blue' : 'default'}
                          style={{
                            cursor: 'pointer',
                            padding: '4px 12px',
                            fontSize: 14,
                          }}
                          onClick={() => {
                            setSelectedTags(
                              selected
                                ? selectedTags.filter((t) => t !== tag)
                                : [...selectedTags, tag]
                            )
                          }}
                        >
                          <HeartOutlined style={{ marginRight: 4 }} />
                          {tag}
                        </Tag>
                      )
                    })}
                  </div>
                </Form.Item>

                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  block
                  onClick={handleStructuredSubmit}
                  loading={loading}
                >
                  开始规划
                </Button>
              </>
            )}
          </Form>
        </Spin>
      </Card>
    </div>
  )
}
