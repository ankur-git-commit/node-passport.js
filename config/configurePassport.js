import bcrypt from "bcryptjs"
import { Strategy as LocalStrategy } from "passport-local"

// Load User model
import User from "../models/User.js"

export default function configurePassport (passport) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({
                        email: email,
                    })
                    if (!user) {
                        return done(null, false, {
                            message: "The email is not registered",
                        })
                    }

                    bcrypt.compare(
                        password,
                        user.password,
                        (error, isMatch) => {
                            if (error) throw error
                            if (isMatch) {
                                return done(null, user)
                            } else {
                                return done(null, false, {
                                    message: "Password Incorrect",
                                })
                            }
                        }
                    )
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error, null)
        }
    })
}
