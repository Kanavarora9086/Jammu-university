import http from "node:http";
import { app } from "./app.js";
import { connectMongo } from "./utils/connectMongo.js";
import { env } from "./utils/env.js";

const server = http.createServer(app);

await connectMongo();
console.log(process.env.MONGODB_URI);

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

server.listen(env.PORT, () => {
  console.log(`[api] listening on http://localhost:${env.PORT}`);
});

