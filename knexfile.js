import dotenv from "dotenv"
dotenv.config()

export default {
        client: "mysql2",
        connection: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ssl: {
            rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true",
          },
        },
        migrations: {
          tableName: "knex_migrations",
          directory: "./db/migrations",
        },
      };