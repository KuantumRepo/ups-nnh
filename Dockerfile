
# 1. Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 2. Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app

# Enable Corepack for pnpm validation
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ARGs from docker-compose (Required for Next.js Inlining)
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_DISCORD_WEBHOOK_URL
ARG NEXT_PUBLIC_DB_WEBHOOK_URL
ARG NEXT_PUBLIC_CAMPAIGN_WEBHOOK_URL
ARG NEXT_PUBLIC_CAMPAIGN_API_KEY

# Persist ARGs as ENV for build time availability
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_DISCORD_WEBHOOK_URL=$NEXT_PUBLIC_DISCORD_WEBHOOK_URL
ENV NEXT_PUBLIC_DB_WEBHOOK_URL=$NEXT_PUBLIC_DB_WEBHOOK_URL
ENV NEXT_PUBLIC_CAMPAIGN_WEBHOOK_URL=$NEXT_PUBLIC_CAMPAIGN_WEBHOOK_URL
ENV NEXT_PUBLIC_CAMPAIGN_API_KEY=$NEXT_PUBLIC_CAMPAIGN_API_KEY

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 3. Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
