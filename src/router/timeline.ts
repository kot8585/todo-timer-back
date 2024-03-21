import express from "express";
import { timelineRepository } from "../repository";
import { Between } from "typeorm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

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
  const result = await timelineRepository.save(req.body);
  console.log("타임라인 잘 들어갓나 ", result);
  res.status(200).json();
});

module.exports = router;
