import { proxyMiddleware } from './middleware/proxy.middleware'
import { registerMiddleware } from './middleware/registerMiddleware'

export default registerMiddleware([proxyMiddleware])
export const config = {
  matcher: ['/((?!.*\\.).*)'],
}
