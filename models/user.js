/** User class for message.ly */
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");

/** User of the site. */

class User {
  constructor(username, password, first_name, last_name, phone) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
  }

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(`
    INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]);
    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(`
    SELECT username, password FROM users
    WHERE username=$1`, [username]);
    const user = result.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return true;
      }
      else return false;
    }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(`
    UPDATE users 
    SET last_login_at=CURRENT_TIMESTAMP
    WHERE username=$1`, [username]);

  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query(`
    SELECT username, first_name, last_name, phone
    FROM users`);
    // const users = results.rows.map(row => new User(row.username, row.first_name, row.last_name, row.phone))
    return results.rows
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(`
    SELECT username,first_name, last_name, phone, join_at, last_login_at
    FROM users
    WHERE username =$1 `, [username]);
    if (result.rows.length === 0) {
      throw new ExpressError('User not found', 404)
    }
    return result.rows[0]
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const msgResults = await db.query(`
    SELECT m.id, m.from_username, m.to_username, m.body, m.sent_at, m.read_at, 
    u.username, u.first_name, u.last_name, u.phone
    FROM messages AS m 
    LEFT JOIN users AS u
    ON m.to_username = u.username
    WHERE m.from_username =$1`, [username]);
    const all_msgs = msgResults.rows.map(({ id, body, read_at, sent_at, to_username, first_name, last_name, phone, username }) => ({
      id: id,
      body: body,
      read_at: read_at,
      sent_at: sent_at,
      to_user: {
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        username: username
      }
    }))
    return all_msgs;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const msgResults = await db.query(`
    SELECT m.id, m.from_username, m.to_username, m.body, m.sent_at, m.read_at, 
    u.username, u.first_name, u.last_name, u.phone
    FROM messages AS m 
    LEFT JOIN users AS u
    ON m.from_username = u.username
    WHERE m.to_username =$1`, [username]);
    const all_msgs = msgResults.rows.map(({ id, body, read_at, sent_at, from_username, first_name, last_name, phone, username }) => ({
      id: id,
      body: body,
      read_at: read_at,
      sent_at: sent_at,
      from_user: {
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        username: username
      }
    }))
    return all_msgs;
  }
}


module.exports = User;