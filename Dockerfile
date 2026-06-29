# ─────────────────────────────────────────────
# Base Stage — shared dependency layer
# ─────────────────────────────────────────────
FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn --frozen-lockfile

# ─────────────────────────────────────────────
# Development Stage — hot reload via next dev
# Used with: docker-compose-dev.yml
# ─────────────────────────────────────────────
FROM base AS dev
WORKDIR /app
COPY . .

ENV PORT=80
EXPOSE 80

CMD ["yarn", "dev"]

# ─────────────────────────────────────────────
# Build Stage — produces .next output
# ─────────────────────────────────────────────
FROM base AS build
WORKDIR /app
COPY . .

ARG NEXT_PUBLIC_TDB_TTT_SERVICE
ARG NEXT_PUBLIC_TDB_TTT_SERVICE_AUTHORIZATION
ARG NEXT_PUBLIC_NEXTAUTH_URL
ARG NEXT_PUBLIC_DEFAULT_CHAT_ID
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_TDB_TTT_SERVICE=$NEXT_PUBLIC_TDB_TTT_SERVICE \
    NEXT_PUBLIC_TDB_TTT_SERVICE_AUTHORIZATION=$NEXT_PUBLIC_TDB_TTT_SERVICE_AUTHORIZATION \
    NEXT_PUBLIC_NEXTAUTH_URL=$NEXT_PUBLIC_NEXTAUTH_URL \
    NEXT_PUBLIC_DEFAULT_CHAT_ID=$NEXT_PUBLIC_DEFAULT_CHAT_ID \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
    
RUN yarn build

# ─────────────────────────────────────────────
# Production Stage — minimal runtime image
# Used with: docker-compose.yml
# ─────────────────────────────────────────────
FROM node:18-alpine AS prod
WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./
COPY --from=build /app/configuration ./configuration

ENV PORT=80
EXPOSE 80

CMD ["yarn", "start"]
