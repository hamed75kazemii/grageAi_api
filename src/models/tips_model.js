import pool from "../utilities/mysql_database.js";

class TipsModel {
  static getTips = async () => {
    const [result] = await pool.query("select * from tips");
    return result;
  };
}

export default TipsModel;
