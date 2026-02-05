import express from "express";
import { signUp,login } from "../controllers/userController";

const router=express.Router();

router.post("/signup", signUp);
router.post("/login", login);


router.get("/me", verifyToken, (req, res) => {
  res.json({ message: "ok", user: req.user });
});

export default router;