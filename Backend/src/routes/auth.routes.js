import { Router } from "express"

import {
signup,
login,
refresh,
logout,
requestOtp,
verifyOtp,
resetPasswordOtp,
findId
} from "../controllers/auth.controller.js"

const router = Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/refresh",refresh)
router.post("/logout",logout)

router.post("/request-otp",requestOtp)
router.post("/verify-otp",verifyOtp)
router.post("/reset-password-otp",resetPasswordOtp)

router.get("/find-id",findId)

export default router