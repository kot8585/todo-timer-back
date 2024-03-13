import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";

const app = express();
const port = 8080;

// Body값 처리할 수 있도록
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) =>
  res.status(200).send("Hello, RyuWoong?")
);

//router 선언
const userRouter = require("./router/user");
const categoryRouter = require("./router/category");
const todoRouter = require("./router/todo");

AppDataSource.initialize().then(() => console.log("☘️ DB Connection"));

const server = app.listen(port, () => {
  console.log(`server on ${port}`);
});

app.use("/user", userRouter);
app.use("/categories", categoryRouter);
app.use("/todos", todoRouter);
