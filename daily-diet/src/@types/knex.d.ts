import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      email: string;
      password: string;
    };
    meals: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      date_hour: string;
      is_diet: boolean;
    };
  }
}
