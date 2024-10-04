import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";
sequelize;
import { routesClient } from "./routes/client/index.route";
const app: Express = express();
const port: number | string = process.env.PORT || 3000;
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
routesClient(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});