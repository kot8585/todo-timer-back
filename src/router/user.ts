import express from "express";
import { userRepository } from "../repository";
import { Category } from "../entity/category";

const router = express.Router();

// middleware that is specific to this router
// const timeLog = (req, res, next) => {
//   console.log('Time: ', Date.now())
//   next()
// }
// router.use(timeLog)
router.get("/", (req: any, res: any, next: any) => {
  res.json({ message: "Get request to the test User" });
});

router.post("/", async (req, res, next) => {
  console.log("user 요청 받음", req.body);
  //TODO: 이거 실패했을때 처리 해줘야되는데....
  await userRepository.save(req.body);

  // TODO: 회원가입 시 기본 더미데이터 세팅해주기
  // 이거 객체 만들어서 데이터베이스에 저장하는게 가독성이 훨씬 좋을 것 같은데
  // 데이터베이스 엔티티랑 실제 객체랑 따로 만드나?
  // 프로젝트 구조 짜야될 것 같아.
  const dummuyCategory = new Category();

  res.status(200).json();
});
// router.delete("/", (req, res, next) => {
//   res.json({ message: "DELETE request to the test homepage" });
// });

module.exports = router;
