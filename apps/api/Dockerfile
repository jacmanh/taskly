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
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
COPY --from=prisma /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=prisma /app/node_modules/.prisma /app/node_modules/.prisma
RUN npx nx run api:build:production

FROM node-builder
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=prisma /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=prisma /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=prisma /app/prisma /app/prisma
COPY --from=build /app/dist/apps/api /app/dist

RUN rm -rf /app/node_modules/.cache

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]