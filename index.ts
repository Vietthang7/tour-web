import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";
sequelize;
import flash from 'express-flash';
import session from 'express-session';
import bodyParser from "body-parser";
import { systemConfig } from "./config/system";
import path from "path";
import methodOverride from 'method-override';
import { routesClient } from "./routes/client/index.route";
import { adminRoutes } from "./routes/admin/index.route";

const app: Express = express();
const port: number | string = process.env.PORT || 3000;
app.use(methodOverride('_method'));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET, // Thay đổi secret này cho phù hợp  
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
// app.use(flash());
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin;
adminRoutes(app);
routesClient(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});