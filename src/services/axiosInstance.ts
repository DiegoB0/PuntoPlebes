import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig
} from 'axios'
import Cookies from 'js-cookie'

const apiURL = process.env.NEXT_PUBLIC_API_URL
const apiKey = process.env.NEXT_PUBLIC_API_KEY

if (apiURL == null) {
  throw new Error('API URL is not defined')
}

if (apiKey == null) {
  throw new Error('API KEY is not defined')
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${apiURL}/`,
  timeout: 3000,
  validateStatus: null
})

const setToken = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = Cookies.get('token')
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}
const setApiKey = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (config.headers) {
    config.headers['x-api-key'] = apiKey
  }
  return config
}

axiosInstance.interceptors.request.use(
  (config) => setApiKey(config),
  async (error) => await Promise.reject(error)
)

axiosInstance.interceptors.request.use(
  (config) => setToken(config),
  async (error) => await Promise.reject(error)
)

export default axiosInstance
