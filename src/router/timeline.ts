import express from "express";
import { timelineRepository } from "../repository";
import { Between, getConnection, getManager } from "typeorm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Todo } from "../entity/todo";
import { Timeline } from "../entity/timeline";
import { AppDataSource } from "../data-source";

const router = express.Router();

// Day.js 플러그인 활성화 utc로 설정안하면 database랑 시간대가 안맞는듯
dayjs.extend(utc);

router.get("/", async (req: any, res, next) => {
  const { date, userUid } = req.query;
  console.log("timeline get date", date);
  const targetDate = dayjs(date).utc();
  console.log(
    "/timeline 조회 date: ",
    targetDate.format(),
    targetDate.toDate()
  );
  const nextDay = targetDate.add(1, "day");
  const timelines = await timelineRepository
    .createQueryBuilder("timeline")
    .select([
      "timeline.idx AS idx",
      "HOUR(timeline.startDateTime) AS startHour",
      "MINUTE(timeline.startDateTime) AS startMinute",
      "HOUR(timeline.endDateTime) AS endHour",
      "MINUTE(timeline.endDateTime) AS endMinute",
      "timeline.executionTime AS executionTime",
      "todo.idx AS todoIdx",
      "todo.title AS todoTitle",
      "todo.color AS todoColor",
    ])
    .leftJoin("timeline.todo", "todo")
    .leftJoin("todo.category", "category")
    .where({
      startDateTime: Between(targetDate.format(), nextDay.format()),
    })
    .andWhere("todo.userUid = :userUid", { userUid })
    .getRawMany();

  console.log("Timeline 조회: ", timelines);
  res.status(200).json(timelines);
});

router.post("/", async (req, res, next) => {
  console.log("타임라인 생성 : ", req.body);
  const { todoIdx, startDateTime, endDateTime, executionTime, action } =
    req.body;

  const entityManager = AppDataSource.createEntityManager();

  try {
    await entityManager.transaction(async (transactionalEntityManager) => {
      const timeline = transactionalEntityManager.create(Timeline, {
        todoIdx,
        startDateTime,
        endDateTime,
        executionTime,
      });

      const result = await transactionalEntityManager.save(timeline);

      const todo = await transactionalEntityManager.findOne(Todo, {
        where: {
          idx: todoIdx,
        },
      });
      if (!todo) {
        console.log("Todo가 존재하지 않습니다.");
        return;
      }
      if (action === "complete") {
        await transactionalEntityManager.update(
          Todo,
          { idx: todoIdx },
          {
            isCompleted: true,
            executionTime: todo.executionTime + executionTime,
          }
        );
      } else {
        await transactionalEntityManager.update(
          Todo,
          { idx: todoIdx },
          { executionTime: todo.executionTime + executionTime }
        );
      }

      console.log("타임라인 잘 들어갓나 ", result);
    });
  } catch (error) {
    console.error("트랜잭션 오류:", error);
  }

  res.status(200).json();
});

router.put("/:timelineIdx", async (req, res, next) => {
  console.log("todo 수정 : ", req.body);
  const result = await timelineRepository.save(req.body);
  res.status(200).json(result);
});

router.delete("/:timelineIdx", async (req, res, next) => {
  console.log("todo 삭제 : ", req.body);
  const result = await timelineRepository.delete(req.params.timelineIdx);
  res.status(200).json(result);
});

module.exports = router;
