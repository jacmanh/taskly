FROM node:18-alpine AS node-builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install dependencies
FROM node-builder AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build the app
FROM node-builder AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN npx nx run api:build:production

FROM node-builder
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist/apps/api /app/dist

CMD ["node", "dist/main.js"]