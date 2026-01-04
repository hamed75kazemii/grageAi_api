import pool from "../src/utilities/mysql_database.js";
import dotenv from "dotenv";

dotenv.config();

async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_DATABASE}`);
    console.log(`User: ${process.env.DB_USER}`);

    // Test connection with a simple query
    const [rows] = await pool.query("SELECT 1 as test");

    console.log("✅ Database connection successful!");
    console.log("Test query result:", rows);

    // Test getting current database name
    const [dbRows] = await pool.query("SELECT DATABASE() as current_db");
    console.log("Current database:", dbRows[0].current_db);

    // Test getting MySQL version
    const [versionRows] = await pool.query("SELECT VERSION() as version");
    console.log("MySQL version:", versionRows[0].version);

    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error("Error details:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

testDatabaseConnection();
