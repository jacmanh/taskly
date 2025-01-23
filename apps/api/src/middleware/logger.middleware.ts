import { pinoHttp } from 'pino-http'

const logger = pinoHttp({
  redact: ['req.headers.authorization'],
  serializers: {
    req(req) {
      const headers = { ...req.headers }
      if (headers.authorization) {
        headers.authorization = 'Bearer ***REDACTED***'
      }
      return {
        method: req.method,
        url: req.url,
        headers,
      }
    },
  },
})

export default logger
