import axios from 'axios'

const API_URL =
  process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_API_URL : ''

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

const replaceUrl = (url: string) => {
  if (process.env.NODE_ENV === 'development') {
    return url.replace(/^\/api/, '')
  }
  return url
}

export const HttpService = {
  get: async (url: string) => {
    const response = await axiosInstance.get(replaceUrl(url))
    return response.data
  },
  post: async (url: string, body: unknown) => {
    const response = await axiosInstance(replaceUrl(url), {
      method: 'POST',
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  },
}
