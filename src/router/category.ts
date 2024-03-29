import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import express from "express";
import { categoryRepository } from "../repository";
import { AppDataSource } from "../data-source";
import { getRepository } from "typeorm";
import { Category } from "../entity/category";
import { Todo } from "../entity/todo";

const router = express.Router();
dayjs.extend(utc);
router.get("/", async (req: any, res, next) => {
  console.log("req.params.getTodos: ", req.query);

  const startDateUtc = dayjs(req.query.selectedDate);
  const endDateUtc = startDateUtc.add(1, "day");
  const categoriesWithTodos = await categoryRepository
    .createQueryBuilder("category")
    .leftJoinAndSelect(
      "category.todos",
      "todos",
      "todos.startDate BETWEEN :startDate AND :endDate",
      {
        startDate: startDateUtc.format("YYYY-MM-DD"),
        endDate: endDateUtc.format("YYYY-MM-DD"),
      }
    )
    .where("category.userUid = :userUid", { userUid: req.query.userUid })
    .getMany();

  const setCategoryExecutionTime = categoriesWithTodos.map((category) => ({
    ...category,
    executionTime: category?.todos?.reduce(
      (total, todo) => total + todo.executionTime,
      0
    ),
  }));
  console.log("제발...", setCategoryExecutionTime);

  res.status(200).json(setCategoryExecutionTime);
});

router.post("/", async (req, res, next) => {
  console.log("카테고리 생성 : ", req.body);
  await categoryRepository.save(req.body);
  res.status(200).json();
});

router.put("/:categoryIdx", async (req, res, next) => {
  console.log("category 수정 : ", req.body);
  const result = await categoryRepository.save(req.body);
  res.status(200).json(result);
});

router.delete("/:categoryIdx", async (req, res, next) => {
  console.log("카테고리 삭제: ", req.body);

  const categoryRepository = getRepository(Category);
  const todoRepository = getRepository(Todo);

  // 트랜잭션 시작
  const entityManager = AppDataSource.createEntityManager();
  await entityManager.transaction(async (transactionalEntityManager) => {
    try {
      // 카테고리에 속한 모든 할 일 삭제
      await todoRepository.delete(req.params.categoryIdx);

      // 카테고리 삭제
      await categoryRepository.delete(req.params.categoryIdx);
    } catch (error) {
      // 오류 발생 시 롤백
      console.error("트랜잭션 오류:", error);
      throw error; // 오류를 다시 던져서 상위 핸들러로 전달
    }
  });

  res
    .status(200)
    .json({ message: "카테고리 및 해당 할 일들이 성공적으로 삭제되었습니다." });
});

module.exports = router;
