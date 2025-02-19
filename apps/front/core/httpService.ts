import axios from 'axios'

const API_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_API_URL
    : undefined

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(async (config) => {
  // replace url for local development
  if (process.env.NODE_ENV === 'development') {
    config.url = config.url?.replace(/^\/api/, '')
  }
  return config
})

export const HttpService = {
  get: async <T = unknown>(
    url: string,
    headers?: Record<string, string>
  ): Promise<T> => {
    const response = await axiosInstance.get<T>(url, { headers })
    return response.data
  },
  post: async <T = unknown>(
    url: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<T> => {
    const response = await axiosInstance.post<T>(url, body, {
      headers,
    })

    return response.data
  },
}
