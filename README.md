# Vivida Infrastructure Starter

This folder is a production-oriented starter backend for the deployed `Vivida AI` app at [vivida-clip-flow.base44.app](https://vivida-clip-flow.base44.app).

## What I inferred from the live app

The product goal is a premium short-form video platform that should:

- turn prompts or ideas into TikTok / Reels / Shorts videos
- store projects and generated outputs
- support an idea engine
- show analytics
- schedule and publish content
- handle billing / plan limits
- support templates, voices, and marketplace-style assets

The deployed bundle currently appears to have:

- a real `Project` entity
- dashboard routes for create, projects, analytics, scheduler, marketplace, billing, settings
- mock or placeholder analytics / scheduler / marketplace data
- no clear evidence of a complete generation pipeline from the client bundle alone

## What this starter gives you

- a TypeScript API service layout
- a generation job pipeline model
- provider interfaces for LLM, TTS, image/video, storage, and publishing
- queue-ready worker orchestration
- a SQL schema to anchor the data model
- a concrete environment contract

## Current generation behavior

This repo now supports a real local first-pass pipeline:

- script generation with a local scripted generator
- voiceover generation using macOS `say`
- MP3 conversion with `ffmpeg`
- vertical MP4 rendering with burned-in text overlays

The output is simple, but it is a real generated video file served by the backend.

After a generation completes, the video is available under:

- `/generated/video/<file>.mp4`

and the generation response includes `videoUrl`.

## Recommended production stack

- API: Fastify or Express on Node.js
- DB: Postgres
- Queue: Redis + BullMQ or Cloud Tasks
- Object storage: S3 / Cloudflare R2
- Auth: Base44 auth bridge or your exported app auth provider
- AI text/script generation: OpenAI
- TTS: ElevenLabs or Cartesia
- Images/video clips: Runway / Pika / Luma / Stock providers / custom uploads
- Rendering: Remotion renderer worker
- Publishing: TikTok / YouTube / Instagram via approved APIs or manual export flow
- Billing: Stripe
- Monitoring: Sentry + structured logs

## Core pipeline

1. User creates a project.
2. API stores project config and enqueues a generation job.
3. Worker generates script, hook, title, captions, and shot plan.
4. Worker generates or resolves visual assets.
5. Worker generates voiceover audio.
6. Worker assembles timeline and renders a final video.
7. Worker stores assets and updates project / generation state.
8. Optional publish job pushes to platform connectors or prepares an export package.

## Important missing pieces in the deployed app

- background job orchestration
- asset storage and signed URLs
- generation state machine
- provider credential management
- plan / quota enforcement
- usage metering
- publishing integrations
- webhook ingestion
- moderation and abuse checks
- observability around failed renders

## Suggested Base44 integration path

If you export the Base44 app source, wire these endpoints into the create/project pages:

- `POST /v1/projects`
- `GET /v1/projects/:id`
- `POST /v1/projects/:id/generations`
- `GET /v1/generations/:id`
- `POST /v1/publish-jobs`
- `GET /v1/me/usage`

Until you export the frontend, this backend can still serve as the system contract for rebuilding the app outside Base44.

## How to use this folder

1. Copy `.env.example` to `.env`.
2. Choose actual providers.
3. Implement the interfaces in `src/providers/`.
4. Connect queue processing in `src/workers/pipeline.ts`.
5. Point your frontend to these endpoints.

## Deploying under `krewboard.com/viralforge`

If you want this backend to live at:

- `https://krewboard.com/viralforge`

set this in `.env`:

```bash
API_BASE_URL=https://krewboard.com
API_PREFIX=/viralforge
```

Then the routes become:

- `https://krewboard.com/viralforge/health`
- `https://krewboard.com/viralforge/v1/projects`
- `https://krewboard.com/viralforge/v1/generations/:id`

Your reverse proxy or hosting platform must forward `/viralforge` traffic to this Node app.

### Example Nginx path proxy

```nginx
location /viralforge/ {
    proxy_pass http://127.0.0.1:4000/viralforge/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Example PM2 launch

```bash
pm2 start npm --name vivida-backend -- run dev
```

For production, replace `npm run dev` with a build/start flow:

```bash
npm install
npm run build
pm2 start dist/index.js --name vivida-backend
```

## Reality check

I could inspect the live deployed app and infer the product direction, but I do not have the actual Base44 source export in this workspace. That means I can build the backend contract and starter implementation safely, but wiring the live UI directly will require either:

- the exported codebase, or
- access to Base44's backend/actions layer for that app
