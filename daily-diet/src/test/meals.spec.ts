import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../app";
import { execSync } from "node:child_process";
import supertest from "supertest";

describe("Meals Routes", () => {
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

  it("should be able to create a meal", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    const createMealResponse = await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      })
      .expect(201);
  });

  it("should be able to list all meals", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      })
      .expect(201);

    const listMealsResponse = await supertest(app.server)
      .get("/meals")
      .auth(token, {
        type: "bearer",
      })
      .expect(200);

    expect(listMealsResponse.body).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        name: "nome refeicao",
        description: "descricao",
        date_hour: expect.any(String),
        is_diet: 1,
      }),
    ]);
  });

  it("should be able to get one meal", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      })
      .expect(201);

    const listMealsResponse = await supertest(app.server)
      .get("/meals")
      .auth(token, {
        type: "bearer",
      });

    const mealId = listMealsResponse.body[0].id;

    const mealResponse = await supertest(app.server)
      .get(`/meals/${mealId}`)
      .auth(token, {
        type: "bearer",
      })
      .expect(200);

    expect(mealResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "nome refeicao",
        description: "descricao",
        date_hour: expect.any(String),
        is_diet: 1,
      })
    );
  });

  it("should be able to update a meal", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      })
      .expect(201);

    const listMealsResponse = await supertest(app.server)
      .get("/meals")
      .auth(token, {
        type: "bearer",
      });

    const mealId = listMealsResponse.body[0].id;

    const mealResponse = await supertest(app.server)
      .put(`/meals/${mealId}`)
      .auth(token, {
        type: "bearer",
      })
      .send({
        name: "nome refeicao update",
        description: "descricao update",
        date_hour: new Date(),
        is_diet: false,
      })
      .expect(204);
  });

  it("should be able to delete a meal", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      })
      .expect(201);

    const listMealsResponse = await supertest(app.server)
      .get("/meals")
      .auth(token, {
        type: "bearer",
      });

    const mealId = listMealsResponse.body[0].id;

    const mealResponse = await supertest(app.server)
      .delete(`/meals/${mealId}`)
      .auth(token, {
        type: "bearer",
      })
      .expect(204);
  });

  it("should be able to count all meals", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      });

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: false,
      })
      .auth(token, {
        type: "bearer",
      });

    const listMealsResponse = await supertest(app.server)
      .get("/meals/count")
      .auth(token, {
        type: "bearer",
      })
      .expect(200);

    expect(listMealsResponse.body).toEqual(
      expect.objectContaining({
        count: 2,
      })
    );
  });

  it("should be able to count all diet meals", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      });

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: false,
      })
      .auth(token, {
        type: "bearer",
      });

    const listMealsResponse = await supertest(app.server)
      .get("/meals/count-diet")
      .auth(token, {
        type: "bearer",
      })
      .expect(200);

    expect(listMealsResponse.body).toEqual(
      expect.objectContaining({
        count: 1,
      })
    );
  });

  it("should be able to count all not diet meals", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      });

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: false,
      })
      .auth(token, {
        type: "bearer",
      });

    const listMealsResponse = await supertest(app.server)
      .get("/meals/count-not-diet")
      .auth(token, {
        type: "bearer",
      })
      .expect(200);

    expect(listMealsResponse.body).toEqual(
      expect.objectContaining({
        count: 1,
      })
    );
  });

  it("should be able to count the best strict diet meals", async () => {
    await supertest(app.server).post("/auth/signup").send({
      email: "email@test.com",
      password: "123456",
    });

    const signinResponse = await supertest(app.server)
      .post("/auth/signin")
      .send({
        email: "email@test.com",
        password: "123456",
      });

    const token = signinResponse.body.token;

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: true,
      })
      .auth(token, {
        type: "bearer",
      });

    await supertest(app.server)
      .post("/meals")
      .send({
        name: "nome refeicao",
        description: "descricao",
        date_hour: new Date(),
        is_diet: false,
      })
      .auth(token, {
        type: "bearer",
      });

    const listMealsResponse = await supertest(app.server)
      .get("/meals/count-best-strick-diet")
      .auth(token, {
        type: "bearer",
      })
      .expect(200);

    expect(listMealsResponse.body).toEqual(
      expect.objectContaining({
        date: expect.any(String),
        count: 1,
      })
    );
  });
});
