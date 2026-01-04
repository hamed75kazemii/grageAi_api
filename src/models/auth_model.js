import pool from "../utilities/mysql_database.js";

class AuthModel {
  static updateUser = async (email, verificationToken, name, password) => {
    const fields = [];
    const values = [];

    fields.push("verification_token = ?");
    values.push(verificationToken);

    if (password) {
      fields.push("password = ?");
      values.push(password);
    }

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    const sql = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE email = ?
      `;

    values.push(email);

    const [result] = await pool.query(sql, values);
    return result;
  };
  static inserUser = async (name, email, password, verificationToken) => {
    const [result] = await pool.query(
      `insert into users 
    (id , name , email , password, verification_token, email_verified, create_at) 
    values ( uuid() , ? ,? , ?, ?, false, CURRENT_TIMESTAMP)`,
      [name, email, password, verificationToken]
    );
    return result;
  };

  static getUserByEmail = async (email) => {
    const [result] = await pool.query(
      "select * from users where email = ? and email_verified = true",
      [email]
    );

    return result[0];
  };

  static findUserByEmail = async (email) => {
    const [result] = await pool.query("select * from users where email = ?", [
      email,
    ]);

    return result[0];
  };

  static sendCodeRecently = async (email) => {
    console.log(email);
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND update_at >= NOW() - INTERVAL 1 MINUTE",
      [email]
    );
    console.log(rows);

    return rows[0];
  };

  static getUserByVerificationToken = async (token) => {
    const [result] = await pool.query(
      "select * from users where verification_token = ?",
      [token]
    );
    return result[0];
  };

  static verifyUserEmail = async (userId) => {
    const [result] = await pool.query(
      `update users 
       set email_verified = true, verification_token = null 
       where id = ?`,
      [userId]
    );
    return result;
  };
}
export default AuthModel;
