/**
 * Cookie 工具函数
 * 用于读取后端自动设置的用户标识 Cookie
 */

/**
 * 读取指定名称的 Cookie 值
 */
export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

/**
 * 获取当前用户ID（从 Cookie 读取，后端首次访问时自动生成）
 */
export function getUserId() {
  return getCookie('X-Travel-User-Id') || 'anonymous'
}
