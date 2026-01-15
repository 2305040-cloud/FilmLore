import express from "express"
import { handleAdminEntry,getAdminStats,sendEmail}from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkAdmin } from "../middleware/checkAdmin.js";

const router=express.Router();

router.post("/admin",verifyToken,checkAdmin,handleAdminEntry)
router.get("/adminStat",verifyToken,checkAdmin,getAdminStats)
router.post("/admin/sendemail",verifyToken,checkAdmin,sendEmail)





export default router;