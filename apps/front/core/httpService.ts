import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
