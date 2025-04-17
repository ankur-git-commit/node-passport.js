import express from "express"
import expressEjsLayouts from "express-ejs-layouts"
import flash from "connect-flash"
import session from "express-session"
import passport from "passport"
import dotenv from "dotenv"
dotenv.config()

import colors from "colors"
import connectDB from "./config/db.js"
import { indexRouter } from "./routes/index.js"
import { userRouter } from "./routes/user.js"
import auth from "./config/configurePassport.js"
import configurePassport from "./config/configurePassport.js"

const PORT = process.env.PORT || 5000
const app = express()

// EJS
app.use(expressEjsLayouts)
app.set("view engine", "ejs")
app.use(express.static("public"))

// Body parser
app.use(express.urlencoded({ extended: false }))

// Session
app.use(
    session({
        resave: true, // don't save session if unmodified
        saveUninitialized: true, // don't create session until something stored
        secret: "keyboard cat",
    })
)

// Passport middleware
configurePassport(passport)
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global Vars (custom MW)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
})

// Connect mongoDB
connectDB()

// Routes
app.use("/", indexRouter)
app.use("/users", userRouter)

// Start server
app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`.bgCyan)
})
