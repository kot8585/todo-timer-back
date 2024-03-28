import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import express from "express";
import { categoryRepository } from "../repository";

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

  res.status(200).json(categoriesWithTodos);
});

router.post("/", async (req, res, next) => {
  console.log("카테고리 생성 : ", req.body);
  await categoryRepository.save(req.body);
  res.status(200).json();
});

module.exports = router;
