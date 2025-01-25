import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export type NextHandler = () => NextResponse

export type MiddlewareHandler = (
  request: NextRequest,
  next: NextHandler,
  event: NextFetchEvent
) => NextResponse | Promise<NextResponse>

export function registerMiddleware(handlers: MiddlewareHandler[] = []) {
  const validMiddlewareHandlers = handlers
    .filter((handler) => typeof handler === 'function')
    .reverse()

  return function (request: NextRequest, event: NextFetchEvent) {
    const next = async (index = 0): Promise<NextResponse> => {
      const current = validMiddlewareHandlers[index]
      if (!current) return NextResponse.next()

      const resolvedNext = (await next(index + 1)) as NextResponse

      const currentResponse = current(request, () => resolvedNext, event)
      if (!(currentResponse instanceof NextResponse)) {
        console.error(
          `The middleware chain has been broken because '${current.name}' did not return a NextResponse or call next().`
        )

        return NextResponse.next()
      }

      return currentResponse
    }

    return next()
  }
}
