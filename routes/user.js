import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import passport from 'passport'

const router = express.Router()

// Login Page
router.get('/login', (req, res) => {
    res.render('login')
})

// Register Page
router.get('/register', (req, res) => {
    res.render('register')
})

// Register Handle
router.post('/register', async (req, res) => {
    const { name, email, password, password2} = req.body

    let errors = []

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ message: 'Please fill all the fields'})
    } 

    if (password !== password2) {
        errors.push({message : 'Passwords do not match'})
    }

    if (password.length < 6){
        errors.push({ message: 'Password should be atleast 6 characters'})
    }

    if (errors.length > 0 ){
        res.render('register', {
            errors,
            name,
            email,
            password, 
            password2
        })
    } else {
        // Validated
        const user = await User.findOne({ email: email })
        if (user) {
            errors.push({ message: 'Email is already registered'})
            res.render('register', {
                errors,
                name,
                email,
                password, 
                password2
            })
        } else {
            const newUser =  new User({
                name,
                email,
                password
            })
            
            // Hash password
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if (error) throw error
                    // Set password to hash
                    newUser.password = hash
                    //Save user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered, ready to log in?')
                            res.redirect('/users/login')
                        })
                        .catch()
                })
            })
        }
    }

})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
    // console.log(req)
    req.logout(() => {console.log('logout')})
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

export { router as userRouter}