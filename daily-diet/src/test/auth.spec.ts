import { afterAll, beforeAll, describe, it, expect, beforeEach } from "vitest";
import { app } from "../app";
import { execSync } from "node:child_process";
import supertest from "supertest";

describe("Auth Routes", () => {
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

  it("should be able to create a user", async () => {
    const response = await supertest(app.server)
      .post("/auth/signup")
      .send({
        email: "email@test.com",
        password: "123456",
      })
      .expect(201);
  });

  it("should be able to signin", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const response = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });
});
