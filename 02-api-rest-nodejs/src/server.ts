import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";
import { env } from "../env";

const app = fastify();

app.post("/hello", async (req, res) => {
  const transaction = await knex("transactions")
    .insert({
      id: crypto.randomUUID(),
      title: "Transação",
      amount: 1000,
    })
    .returning("*");

  return transaction;
});

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });
