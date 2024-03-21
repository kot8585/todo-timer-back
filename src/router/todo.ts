import express from "express";
import { todoRepository } from "../repository";

const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log("todo 생성 : ", req.body);
  const result = await todoRepository.save(req.body);
  res.status(200).json(result);
});

//TODO: 로직 처리하기
router.put("/:todoIdx", async (req, res, next) => {
  console.log("todo 수정 : ", req.body);
  const result = await todoRepository.save(req.body);
  res.status(200).json(result);
});

router.delete("/:todoIdx", async (req, res, next) => {
  console.log("todo 삭제 : ", req.body);
  const result = await todoRepository.delete(req.params.todoIdx);
  res.status(200).json(result);
});

module.exports = router;
