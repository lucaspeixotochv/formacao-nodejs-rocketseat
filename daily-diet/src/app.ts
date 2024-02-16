import fastify from "fastify";
import jwt from "@fastify/jwt";
// import cookie from "@fastify/cookie";
import { AuthRoutes } from "./routes/auth";
import { env } from "./env";
import { MealRoutes } from "./routes/meal";

export const app = fastify();

app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "7d",
  },
});

// app.register(cookie);

app.register(AuthRoutes, {
  prefix: "auth",
});

app.register(MealRoutes, {
  prefix: "meals",
});
