const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const User = require('../models/user')
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const users = User.all();
        return res.send({ users });
    }
    catch (e) {
        return next(e);
    }
})
/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', ensureCorrectUser, async function (req, res, next) {
    try {
        const { username } = req.params;
        const user = User.get(username);
        return res.send({ user });
    }
    catch (e) {
        return next(e);
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async function (req, res, next) {
    try {
        const { username } = req.params;
        const messages = User.messagesTo(username);
        return res.send({ messages });
    }
    catch (e) {
        return next(e);
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureCorrectUser, async function (req, res, next) {
    try {
        const { username } = req.params;
        const messages = User.messagesFrom(username);
        return res.send({ messages });
    }
    catch (e) {
        return next(e);
    }
});

module.exports = router;