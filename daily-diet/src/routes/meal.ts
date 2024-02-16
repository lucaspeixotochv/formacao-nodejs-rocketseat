import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { checkUserToken } from "../middlewares/check-and-extract-user-id";
import { randomUUID } from "node:crypto";

export async function MealRoutes(app: FastifyInstance) {
  app.addHook("onRequest", checkUserToken);

  app.post("/", async (req, reply) => {
    const userId = req.headers["userId"] as string;

    const createMealSchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      date_hour: z.string(),
      is_diet: z.boolean(),
    });

    const { name, description, date_hour, is_diet } = createMealSchema.parse(
      req.body
    );

    await knex("meals").insert({
      id: randomUUID(),
      user_id: userId,
      name,
      description,
      date_hour,
      is_diet,
    });

    return reply.status(201).send();
  });

  app.get("/", async (req, reply) => {
    const userId = req.headers["userId"] as string;

    const meals = await knex("meals").where("user_id", userId);

    return reply.status(200).send(meals);
  });

  app.get("/:id", async (req, reply) => {
    const getTransactionSchemaParams = z.object({
      id: z.string(),
    });

    const { id } = getTransactionSchemaParams.parse(req.params);

    const userId = req.headers["userId"] as string;

    const meal = await knex("meals")
      .where({
        id,
        user_id: userId,
      })
      .first();

    if (!meal) {
      return reply.status(404).send("Meal not found.");
    }

    return reply.status(200).send(meal);
  });

  app.delete("/:id", async (req, reply) => {
    const deleteMealSchemaParams = z.object({
      id: z.string(),
    });

    const { id } = deleteMealSchemaParams.parse(req.params);

    const userId = req.headers["userId"] as string;

    await knex("meals")
      .where({
        user_id: userId,
        id,
      })
      .delete();

    return reply.status(204).send("Meal deleted with success.");
  });

  app.put("/:id", async (req, reply) => {
    const userId = req.headers["userId"] as string;

    const updateMealSchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      date_hour: z.string(),
      is_diet: z.boolean(),
    });

    const updateMealSchemaParams = z.object({
      id: z.string(),
    });

    const { name, description, date_hour, is_diet } = updateMealSchema.parse(
      req.body
    );

    const { id } = updateMealSchemaParams.parse(req.params);

    await knex("meals")
      .where({
        id,
        user_id: userId,
      })
      .update({
        user_id: userId,
        name,
        description,
        date_hour,
        is_diet,
      });

    return reply.status(204).send();
  });

  app.get("/count", async (req, reply) => {
    const userId = req.headers["userId"] as string;

    const mealsQuantity = await knex("meals").where("user_id", userId).count();

    return reply.status(200).send({
      count: mealsQuantity[0]["count(*)"],
    });
  });

  app.get("/count-diet", async (req, reply) => {
    const userId = req.headers["userId"] as string;

    const mealsQuantity = await knex("meals")
      .where("user_id", userId)
      .where("is_diet", true)
      .count();

    return reply.status(200).send({
      count: mealsQuantity[0]["count(*)"],
    });
  });

  app.get("/count-not-diet", async (req, reply) => {
    const userId = req.headers["userId"] as string;

    const mealsQuantity = await knex("meals")
      .where("user_id", userId)
      .where("is_diet", false)
      .count();

    return reply.status(200).send({
      count: mealsQuantity[0]["count(*)"],
    });
  });

  app.get("/count-best-strick-diet", async (req, reply) => {
    const userId = req.headers["userId"] as string;

    const mealsQuantity = await knex("meals")
      .select(
        knex.raw("DATE(date_hour) as date"),
        knex.raw("count(*) as count")
      )
      .where({ user_id: userId, is_diet: true })
      .groupByRaw("DATE(date_hour)")
      .orderBy("count", "desc")
      .first();

    return reply.status(200).send({
      ...mealsQuantity,
    });
  });
}
