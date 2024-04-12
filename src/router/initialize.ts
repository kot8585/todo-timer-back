import express from "express";
import { categoryRepository, todoRepository } from "../repository";

const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log("user 요청 받음", req.body);

  try {
    const { uid } = req.body;

    const category = categoryRepository.create({
      userUid: uid,
      title: "업무",
      color: "#E4D4C8",
    });
    const savedCategory = await categoryRepository.save(category);

    const todos = todoRepository.create([
      {
        userUid: uid,
        categoryIdx: savedCategory.idx,
        title: "왼쪽 상단의 메뉴바에서 카테고리를 추가할 수 있어요",
        color: "#FFC2C7",
        startDate: new Date(),
        isCompleted: false,
        executionTime: 0,
      },
      {
        userUid: uid,
        categoryIdx: savedCategory.idx,
        title: "투두를 완료하려면 스와이프하세요",
        color: "#FFC2C7",
        startDate: new Date(),
        isCompleted: false,
        executionTime: 0,
      },
      {
        userUid: uid,
        categoryIdx: savedCategory.idx,
        title: "투두의 시간을 측정하려면 탭하세요",
        color: "#FFC2C7",
        startDate: new Date(),
        isCompleted: false,
        executionTime: 0,
      },
      {
        userUid: uid,
        categoryIdx: savedCategory.idx,
        title: "투두의 시간을 수정하려면 타임라인을 탭하세요",
        color: "#FFC2C7",
        startDate: new Date(),
        isCompleted: false,
        executionTime: 0,
      },
    ]);
    await todoRepository.save(todos);
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "에러가 발생하였습니다." });
  }
});

module.exports = router;
