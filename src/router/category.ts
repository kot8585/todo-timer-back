import express from "express";
import { categoryRepository } from "../repository";

const router = express.Router();

router.get("/", async (req: any, res, next) => {
  const allCategoriesAndTodos = await categoryRepository.find({
    relations: {
      todos: req.params.getTodos, //todo가져오고싶은지 안가져오고싶은지
    },
    where: {
      userUid: req.params.userUid,
    },
  });
  res.status(200).json(allCategoriesAndTodos);
});

router.post("/", async (req, res, next) => {
  console.log("카테고리 생성 : ", req.body);
  await categoryRepository.save(req.body);
  res.status(200).json();
});

module.exports = router;
