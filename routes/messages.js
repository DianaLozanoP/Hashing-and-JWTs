const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
// const User = require('../models/user');
const Message = require('../models/message');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        const message = Message.get(id);
        const u1 = message.from_user.username
        const u2 = message.to_user.username
        if (u1 !== req.user.username || u1 !== req.user.username) {
            return next({ status: 401, message: "Unauthorized" });
        }
        return res.json({ message })
    }
    catch (e) {
        return next(e)
    }
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const { to_username, body } = req.body;
        const from_username = req.user.username;
        if (from_username === req.user.username) {
            const message = Message.create(from_username, to_username, body)
            return res.json({ message })
        }
        return next({ status: 401, message: "Unauthorized" });
    }
    catch (e) {
        return next(e);
    }
});


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = Message.get(id);
        const u2 = message.to_user.username
        if (u2 === req.user.username) {
            const message = markRead(id);
            return res.json({ message })
        }
        return next({ status: 401, message: "Unauthorized" });
    }
    catch (e) {
        return next(e);
    }
});

module.exports = router;