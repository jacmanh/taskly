import axios from 'axios'

const axiosInstance = axios.create({
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
  put: async <T = unknown>(
    url: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<T> => {
    const response = await axiosInstance.put<T>(url, body, {
      headers,
    })

    return response.data
  },
  delete: async <T = unknown>(
    url: string,
    headers?: Record<string, string>
  ): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, { headers })
    return response.data
  },
}
