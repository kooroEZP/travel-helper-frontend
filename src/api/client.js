import axios from 'axios'

// 创建 axios 实例，支持运行时切换后端
const createClient = (baseURL = '') =>
  axios.create({
    baseURL,
    timeout: 60000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  })

// 默认客户端（Vite proxy 或同域部署）
let client = createClient()

/** 切换后端目标：python / java / custom URL */
export function switchBackend(target) {
  const map = {
    python: 'http://localhost:8005',
    java: 'http://localhost:8080',
  }
  const base = map[target] || target || ''
  client = createClient(base)
}

// ====== 行程规划 ======

/** 自然语言规划 */
export function planTrip(input) {
  return client.post('/api/travel/plan', { input }).then((r) => r.data)
}

/** 结构化请求规划 */
export function planTripStructured(payload) {
  const { userId, ...body } = payload
  return client.post('/api/travel/plan/structured', body).then((r) => r.data)
}

// ====== 用户偏好 ======

export function getPreference(userId) {
  return client.get(`/api/travel/preference/${userId}`).then((r) => r.data)
}

export function getPreferencePrompt(userId) {
  return client.get(`/api/travel/preference/${userId}/prompt`).then((r) => r.data)
}

// ====== 健康检查 ======

export function healthCheck() {
  return client.get('/api/travel/health').then((r) => r.data)
}
