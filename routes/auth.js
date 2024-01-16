/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const User = require('../models/user')

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ExpressError("Username and password required", 400)
        };
        const u = User.authenticate(username, password);
        if (u) {
            const token = jwt.sign({ username }, SECRET_KEY)
            return res.json({ token })
        }
        throw new ExpressError("Invalid username/password", 400)
    }
    catch (e) {
        return next(e);
    }
})
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, phone } = req.body;
        const u = User.register(username, password, first_name, last_name, phone)
        if (u) {
            const token = jwt.sign({ username }, SECRET_KEY)
            return res.json({ token })
        }
    }
    catch (e) {
        if (e.code === '23505') {
            return next(new ExpressError("Username taken, plase choose a new one", 400));
        }
        return next(e);
    }
})