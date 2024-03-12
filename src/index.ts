import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";

const app = express();
const port = 4040;

app.get("/", (req: Request, res: Response) =>
  res.status(200).send("Hello, RyuWoong?")
);

AppDataSource.initialize().then(() => console.log("☘️ DB Connection"));

const server = app.listen(port, () => {
  console.log(`server on ${port}`);
});
