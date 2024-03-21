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
  const targetDate = dayjs(date).utc();
  console.log(" date: ", targetDate.format(), targetDate.toDate());
  const nextDay = targetDate.add(1, "day");
  const timelines = await timelineRepository
    .createQueryBuilder("timeline")
    .select([
      "timeline.idx AS idx",
      "HOUR(timeline.startDateTime) AS startHour",
      "MINUTE(timeline.startDateTime) AS startMinute",
      "HOUR(timeline.endDateTime) AS endHour",
      "MINUTE(timeline.endDateTime) AS endMinute",
      "timeline.elapsedTime AS elapsedTime",
      "todo.idx AS todoIdx",
      "todo.title AS todoTitle",
      "category.color AS categoryColor",
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
  const { todoIdx, startDateTime, endDateTime, elapsedTime, action } = req.body;

  const entityManager = AppDataSource.createEntityManager();

  try {
    await entityManager.transaction(async (transactionalEntityManager) => {
      const timeline = transactionalEntityManager.create(Timeline, {
        todoIdx,
        startDateTime,
        endDateTime,
        elapsedTime,
      });

      const result = await transactionalEntityManager.save(timeline);

      if (action === "complete") {
        const todo = await transactionalEntityManager.findOne(Todo, {
          where: {
            idx: todoIdx,
          },
        });
        if (!todo) {
          console.log("Todo가 존재하지 않습니다.");
          return;
        }
        todo.isCompleted = true;
        await transactionalEntityManager.update(
          Todo,
          { idx: todoIdx },
          { isCompleted: true }
        );
      }

      console.log("타임라인 잘 들어갓나 ", result);
    });
  } catch (error) {
    console.error("트랜잭션 오류:", error);
  }

  res.status(200).json();
});

module.exports = router;
