import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";
sequelize;
import bodyParser from "body-parser";
import { routesClient } from "./routes/client/index.route";
const app: Express = express();
const port: number | string = process.env.PORT || 3000;
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
routesClient(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});