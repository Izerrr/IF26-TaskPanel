# Architecture - IF26 Task Panel (Hybrid Model)

## 1. Tech Stack

- **Frontend Dashboard:** Next.js (App Router, TypeScript), Tailwind CSS, `@hello-pangea/dnd` (Kanban).
- **Frontend Deployment:** Vercel (Edge/Serverless Runtime).
- **Backend Bot Worker:** Node.js (Discord.js v14) running on Ubuntu VPS via PM2.
- **Database:** PostgreSQL or MySQL hosted on VPS.
- **ORM & Client:** Prisma ORM (with Connection Pooling / Accelerate for serverless Vercel compatibility).
- **Auth:** NextAuth.js (Discord OAuth2 Provider).

## 2. System Architecture Diagram

```text
[ Vercel CDN ] (Next.js Dashboard - Steam UI)
      |
      +---> [ DB Connection Pool / API ] <---+
                                             |
[ Discord User ] ---> [ Discord Server ] ---> [ VPS PM2 Worker ] (Discord Bot + MySQL/Postgres)
```
