import dayjs from "dayjs";
import express from "express";
import { getRepository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/category";
import { Todo } from "../entity/todo";
import { categoryRepository, todoRepository } from "../repository";
import utc from "dayjs/plugin/utc";
import { Timeline } from "../entity/timeline";

dayjs.extend(utc);

const router = express.Router();
router.get("/", async (req: any, res, next) => {
  console.log("req.params.getTodos: ", req.query);

  const startDateUtc = dayjs.utc(req.query.selectedDate);
  const endDateUtc = startDateUtc.add(1, "day").subtract(1, "millisecond");

  const result = await categoryRepository
    .createQueryBuilder("category")
    .select([
      "category.idx AS categoryIdx",
      "category.title AS categoryTitle",
      "category.color AS categoryColor",
      "todo.idx AS todoIdx",
      "todo.title AS todoTitle",
      "todo.isCompleted AS isCompleted",
      "COALESCE(todo.color, category.color) AS todoColor",
      "COALESCE(SUM(timeline.executionTime), 0) AS todoExecutionTime",
    ])
    .leftJoin(
      Todo,
      "todo",
      "todo.categoryIdx = category.idx AND todo.startDate BETWEEN :startDate AND :endDate",
      {
        startDate: startDateUtc.format(),
        endDate: endDateUtc.format(),
      }
    )
    .leftJoin(
      Timeline,
      "timeline",
      "todo.idx = timeline.todoIdx AND timeline.startDateTime BETWEEN :startDate AND :endDate",
      {
        startDate: startDateUtc.format(),
        endDate: endDateUtc.format(),
      }
    )
    .where("category.userUid = :userUid", {
      userUid: req.query.userUid,
    })
    .groupBy("todo.idx, category.idx")
    .getRawMany();

  const formattedResult = result.reduce((acc, curr) => {
    // 카테고리가 이미 있는지 확인하고 없으면 새로운 객체를 만듭니다.
    if (!acc[curr.categoryIdx]) {
      acc[curr.categoryIdx] = {
        idx: curr.categoryIdx,
        title: curr.categoryTitle,
        color: curr.categoryColor,
        data: [],
        executionTime: 0, // 카테고리 실행 시간 초기화
      };
    }

    // 할 일 항목을 생성하고 결과에 추가합니다.
    if (curr.todoIdx) {
      acc[curr.categoryIdx].data.push({
        idx: curr.todoIdx,
        title: curr.todoTitle,
        isCompleted: curr.isCompleted,
        color: curr.todoColor,
        executionTime: Number(curr.todoExecutionTime),
      });
      // 할 일 항목의 실행 시간을 카테고리의 실행 시간에 추가합니다.
      acc[curr.categoryIdx].executionTime += Number(curr.todoExecutionTime);
    }

    return acc;
  }, {});

  // 객체를 배열로 변환합니다.
  const finalResult = Object.values(formattedResult);

  console.log(finalResult);
  res.status(200).json(finalResult);
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
