### 📄 5. `.context/RULES.md`

```markdown
# Rules & Development Standards - IF26 Task Panel

1. **Hybrid Security:** Database credentials (`DATABASE_URL`) used by Vercel must be secured with connection pooling to prevent max connection limits on the VPS database.
2. **Steam Design Strictness:** Strictly adhere to the Steam color palette and typography rules specified in `design.md`. Keep UI elements industrial, high-contrast, and sharp.
3. **Bot State Synchronization:** Every task status change initiated via Discord slash command must reflect immediately in the Prisma DB so the Vercel Dashboard picks it up on revalidate / realtime fetch.
4. **Environment Isolation:** Keep `DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_SECRET`, and DB strings in `.env` / Vercel Environment Variables. Never commit secret tokens to GitHub.
```
