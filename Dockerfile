# syntax=docker/dockerfile:1

# bmsite-panel — Nuxt 4 dashboard (customer + admin).
# NOTE: nuxt.config.ts sets `nitro.preset: 'cloudflare_pages'` for the
# Cloudflare Pages deploy; NITRO_PRESET=node-server overrides it for Docker.
# Runtime env: NUXT_API_BASE (private API for the /_api proxy),
# NUXT_PUBLIC_RENDERER_BASE (tenant renderer origin), PORT (default 3000).

ARG BUN_VERSION=1.2
ARG NODE_VERSION=22

FROM docker.io/oven/bun:${BUN_VERSION}-slim AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV NITRO_PRESET=node-server
# NOTE: package.json "build" appends `touch dist/.assetsignore` for the
# Cloudflare Pages deploy; dist/ only exists with that preset, so Docker
# (node-server preset) invokes nuxt directly.
RUN bunx nuxt build

FROM docker.io/library/node:${NODE_VERSION}-slim AS app
ENV NODE_ENV=production
WORKDIR /app
# node:*-slim already ships a UID 1000 user (node); reuse it as appuser.
RUN if ! id -u appuser >/dev/null 2>&1; then \
        EXISTING=$(getent passwd 1000 | cut -d: -f1); \
        if [ -n "$EXISTING" ]; then \
          groupmod -n appuser "$EXISTING" 2>/dev/null || true; \
          usermod -g appuser -l appuser -d /home/appuser -m "$EXISTING"; \
        else useradd -u 1000 -m appuser; fi; \
    fi \
    && chown -R appuser:appuser /app
COPY --from=build --chown=appuser:appuser /app/.output ./.output
USER appuser
ENV PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
