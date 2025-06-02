```sh
npx gitpick nrjdalal/awesome-templates/tree/main/tanstack-apps/tanstack-start better-start
```

```sh
cd better-start && npm install && npm run dev
```

```sh
npm i better-auth drizzle-orm postgres
npm i -D drizzle-kit
```

```env
# .env

BETTER_AUTH_URL=http://localhost:3000
# can be generated using `npx nanoid`
BETTER_AUTH_SECRET=
# can be generated using `npx pglaunch`
POSTGRES_URL=

```

```ts
// drizzle.config.ts

import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  schema: "src/db/schema",
  out: "src/db/drizzle",
})
```

```ts
// src/db/index.ts

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

declare global {
  var db: PostgresJsDatabase
}

let db: PostgresJsDatabase

if (process.env.NODE_ENV === "production") {
  db = drizzle({
    client: postgres(process.env.POSTGRES_URL!, {
      ssl: {
        rejectUnauthorized: true,
      },
    }),
  })
} else {
  if (!global.db) {
    global.db = drizzle({
      client: postgres(process.env.POSTGRES_URL!),
    })
  }
  db = global.db
}

export { db }
```

```ts
// src/db/schema/auth.ts

import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => /* @__PURE__ */ new Date()),
})
```

```ts
// src/lib/auth/index.ts

import { db } from "@/db"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { reactStartCookies } from "better-auth/react-start"

import { account, session, user, verification } from "@/db/schema/auth"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [reactStartCookies()],
})
```

```ts
// src/lib/auth/client.ts

import { createAuthClient } from "better-auth/react"

export const { signIn, signOut, useSession } = createAuthClient()
```

```ts
// src/routes/api/auth/$.ts

import { auth } from "@/lib/auth"

export const ServerRoute = createServerFileRoute().methods({
  GET: ({ request }) => {
    return auth.handler(request)
  },
  POST: ({ request }) => {
    return auth.handler(request)
  },
})
```

```sh
npx drizzle-kit push
```

<details><summary>Expected Output:</summary>

```txt
No config path provided, using default 'drizzle.config.ts'
Reading config file '/path/to/file/drizzle.config.ts'
Using 'postgres' driver for database querying
[✓] Pulling schema from database...
[✓] Changes applied
```

</details>
