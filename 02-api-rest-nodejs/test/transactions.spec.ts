import { afterAll, beforeAll, expect, it, describe, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import { app } from "../src/app";
import supertest from "supertest";

describe("Transactions Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a new transaction", async () => {
    const response = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await supertest(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        title: "New transaction",
        amount: 5000,
        created_at: expect.any(String),
        session_id: expect.any(String),
      }),
    ]);
  });

  it("should be able to get a especific transaction", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await supertest(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    const transactionId = listTransactionsResponse.body[0].id;

    const especificTransactionResponse = await supertest(app.server)
      .get("/transactions/" + transactionId)
      .set("Cookie", cookies)
      .expect(200);

    expect(especificTransactionResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "New transaction",
        amount: 5000,
        created_at: expect.any(String),
        session_id: expect.any(String),
      })
    );
  });

  it("should be able to get the summary", async () => {
    const creditTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "Credit Transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = creditTransactionResponse.get("Set-Cookie");

    const debitTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debit transaction",
        amount: 2000,
        type: "debit",
      });

    const summaryResponse = await supertest(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryResponse.body.summary[0]).toEqual({
      amount: 3000,
    });
  });
});
