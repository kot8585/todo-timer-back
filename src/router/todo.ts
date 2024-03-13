import express from "express";
import { todoRepository } from "../repository";

const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log("todo 생성 : ", req.body);
  const result = await todoRepository.save(req.body);
  res.status(200).json(result);
});

module.exports = router;
