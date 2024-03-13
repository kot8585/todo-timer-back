import express from "express";

const router = express.Router();

// }
// router.use(timeLog)
router.get("/", (req: any, res: any, next: any) => {
  res.json({ message: "Get request to the test Category" });
});
// router.post("/", (req, res, next) => {
//   res.json({ message: "POST request to the test homepage" });
// });
// router.delete("/", (req, res, next) => {
//   res.json({ message: "DELETE request to the test homepage" });
// });

module.exports = router;
