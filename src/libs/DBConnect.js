import { Pool } from "pg";

const url = new URL(process.env.DATABASE_URL);

const user = url.username;
const password = url.password;
const host = url.hostname;
const port = url.port;
const database = url.pathname.substring(1);

const pool = new Pool({
  user,
  password,
  host,
  port,
  database,
});

export default pool;
