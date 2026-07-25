---

### 📄 3. `.context/design.md`

```markdown
# Design System - IF26 Task Panel Dashboard (Steam UI Style)

## 1. Visual Theme Concept

- **Vibe:** Valve Steam Client Industrial Utility, Tactical Dark Mode, High-Contrast Monospace Accents.

## 2. Color Palette (Tailwind Tokens)

- **Main Background:** `#171a21` (`bg-[#171a21]`)
- **Card / Container:** `#1b2838` (`bg-[#1b2838]`)
- **Card Hover / Surface:** `#2a475e` (`bg-[#2a475e]`)
- **Steam Blue Accent:** `#66c0f4` (`text-[#66c0f4]`, `border-[#66c0f4]`)
- **Primary Text:** `#c6d4df` (`text-[#c6d4df]`)
- **Status Success (Done):** `#a3e035` (`text-[#a3e035]`)
- **Status Warning (Due Soon):** `#feab2d` (`text-[#feab2d]`)
- **Status Alert (Overdue):** `#f04747` (`text-[#f04747]`)

## 3. Design & Component Guidelines

- **Border Radius:** Use sharp/subtle borders (`rounded-sm` or `rounded-md`). Avoid heavily rounded shapes (`rounded-2xl`).
- **Typography:** Use crisp sans-serif for titles and uppercase `font-mono` for metadata, tags, task IDs (`#TASK-001`), and status badges.
- **Steam Header Nav:** Tab style navigation (`TASKS`, `BOARDS`, `MEMBERS`) with an active bottom highlight bar in `#66c0f4`.
```
