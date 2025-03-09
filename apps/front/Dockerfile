FROM node:18-alpine AS node-builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@8.12.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
FROM node-builder AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Generate Prisma client
FROM node-builder AS prisma
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY prisma ./prisma
RUN npx prisma generate

# Build the app
FROM node-builder AS build

# Add build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
COPY --from=prisma /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=prisma /app/node_modules/.prisma /app/node_modules/.prisma
RUN npx nx run front:build:production

FROM node-builder AS prod

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/apps/front/public ./public
COPY --from=build --chown=nextjs:nodejs /app/apps/front/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/front/.next/standalone/apps/front/server.js ./server.cjs
COPY --from=build --chown=nextjs:nodejs /app/apps/front/.next/standalone/apps/front/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/apps/front/.next/static ./public/_next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.cjs"]