import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { parse } from "csv-parse";
import { Readable, Writable } from "node:stream";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res
        .setHeader("Content-type", "application/json")
        .end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      database.insert("tasks", {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      });

      return res.writeHead(201).end("Tarefa criada com sucesso.");
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end("Tarefa criada com sucesso.");
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const task = database.selectOne("tasks", id);

      database.update("tasks", id, {
        ...task,
        title,
        description,
        updated_at: new Date(),
      });

      return res.writeHead(204).end("Tarefa criada com sucesso.");
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.selectOne("tasks", id);

      database.update("tasks", id, {
        ...task,
        completed_at: new Date(),
        updated_at: new Date(),
      });

      return res.writeHead(204).end("Tarefa criada com sucesso.");
    },
  },
];
