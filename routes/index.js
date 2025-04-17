import express from "express"
import { ensureAuthenticated } from "../config/auth.js"

const router = express.Router()

//Welcome page
router.get("/", (req, res) => res.render("welcome"))

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    console.log(req.user)
    res.render("dashboard", {
        name:req.user.name
    })
})

export { router as indexRouter }
