import { Elysia, t } from "elysia";
import { Database } from "bun:sqlite";
import { cors } from "@elysiajs/cors";
import Pusher from "pusher";

const db = new Database("db.sqlite");
db.run("CREATE TABLE IF NOT EXISTS emails (subject text, sender text)");

const pusher = new Pusher({
  appId: "app-id",
  cluster: "cluster",
  host: "127.0.0.1",
  port: "6001",
  key: "app-key",
  secret: "app-secret",
});

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .get("/emails", () => {
    return db.query("SELECT sender,subject FROM emails").all();
  })
  .post(
    "/emails",
    ({ body }) => {
      const { sender, subject } = body;
      // insert value into db
      db.run("INSERT INTO emails (subject, sender) VALUES ($1, $2)", [
        subject,
        sender,
      ]);
      pusher.trigger("emails", "received", null);
    },
    {
      body: t.Object({ subject: t.String(), sender: t.String() }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
