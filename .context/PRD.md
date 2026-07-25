# Product Requirements Document (PRD) - IF26 Task Panel

## 1. Overview

An integrated task management system combining a Discord Bot for chat-based task tracking with a Next.js Web Dashboard. Features a Valve/Steam Client-inspired tactical dark UI, Kanban board workflow, and Discord OAuth2 login.

## 2. Core Features

- **Discord Bot Slash Commands:** `/task create`, `/task assign`, `/task list`, `/task status`, `/task deadline`.
- **Automated Deadline Reminders:** Scheduled Discord channel alerts for upcoming and overdue tasks.
- **Steam-Inspired Kanban Dashboard:** Drag-and-drop task columns (To Do, In Progress, Review, Done) styled with Valve's Steam client UI aesthetics.
- **Discord OAuth2 SSO:** Single Sign-On using Discord accounts to verify server permissions and assignees.
- **Realtime Synchronization:** Instant updates between Discord server commands and the web Kanban board.

## 3. Non-Functional Requirements

- **Hybrid Hosting:** Frontend deployed on Vercel for zero-latency CDN; Bot & Database hosted on Ubuntu VPS.
- **Sub-Second Execution:** Low latency slash command responses.
- **Responsive Industrial UI:** Optimized for desktop and mobile viewport controls.
