import { FastifyInstance } from "fastify";
import { z } from "zod";
import { env } from "../env";
import { knex } from "../database";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

export async function AuthRoutes(app: FastifyInstance) {
  app.post("/signup", async (req, reply) => {
    const createUserSchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = createUserSchema.parse(req.body);

    const emailExists = await knex("users").where("email", email).first();

    if (emailExists) {
      return reply.status(409).send("This email is already being used.");
    }

    const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT);

    await knex("users").insert({
      id: randomUUID(),
      email,
      password: hashedPassword,
    });

    reply.status(201).send();
  });

  app.post("/signin", async (req, reply) => {
    const signinSchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = signinSchema.parse(req.body);

    const user = await knex("users").where({ email }).first();

    if (!user) {
      return reply.status(404).send("Incorrect email or password.");
    }

    const passwordIsCorret = await bcrypt.compare(password, user.password);

    if (!passwordIsCorret) {
      return reply.status(404).send("Incorrect email or password.");
    }

    const token = app.jwt.sign({ userId: user.id });

    return reply.status(200).send({ token });
  });
}
