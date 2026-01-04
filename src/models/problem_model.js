import pool from "../utilities/mysql_database.js";

class ProblemModel {
  static getProblems = async () => {
    const [result] = await pool.query("select * from problems");
    return result;
  };
}

export default ProblemModel;
