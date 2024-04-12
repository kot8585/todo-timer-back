import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";

const app = express();
const port = 8080;

// Body값 처리할 수 있도록
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router 선언
const initializeRouter = require("./router/initialize");
const categoryRouter = require("./router/category");
const todoRouter = require("./router/todo");
const timelineRouter = require("./router/timeline");

AppDataSource.initialize().then(() => console.log("☘️ DB Connection"));

const server = app.listen(port, () => {
  console.log(`server on ${port}`);
});

app.use("/", initializeRouter);
app.use("/categories", categoryRouter);
app.use("/todos", todoRouter);
app.use("/timelines", timelineRouter);
