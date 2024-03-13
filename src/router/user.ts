import express from "express";

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
// router.post("/", (req, res, next) => {
//   res.json({ message: "POST request to the test homepage" });
// });
// router.delete("/", (req, res, next) => {
//   res.json({ message: "DELETE request to the test homepage" });
// });

module.exports = router;
