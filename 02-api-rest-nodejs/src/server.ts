import fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";

const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: "transactions",
});

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });
