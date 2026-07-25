# Schema & Database Models - IF26 Task Panel

## Prisma Models (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql" // or "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Guild {
  id        String   @id // Discord Guild ID
  name      String
  icon      String?
  tasks     Task[]
  createdAt DateTime @default(now())
}

model User {
  id            String   @id // Discord User ID
  username      String
  avatar        String?
  assignedTasks Task[]   @relation("AssignedUser")
}

model Task {
  id          String     @id @default(uuid())
  guildId     String
  guild       Guild      @relation(fields: [guildId], references: [id], onDelete: Cascade)
  title       String
  description String?    @db.Text
  status      TaskStatus @default(TODO)
  assignedTo  String?
  assignee    User?      @relation("AssignedUser", fields: [assignedTo], references: [id])
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}
```
