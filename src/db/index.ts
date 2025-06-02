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
