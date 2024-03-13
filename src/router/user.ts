import express from "express";
import { userRepository } from "../repository";

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
  res.status(200).json();
});
// router.delete("/", (req, res, next) => {
//   res.json({ message: "DELETE request to the test homepage" });
// });

module.exports = router;
