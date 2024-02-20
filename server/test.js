import { configDotenv } from "dotenv";
import mysql from "mysql2";
configDotenv();

console.log(process.env.MYSQL_HOST);

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

const print = () => {
  const query = "SELECT * FROM categories";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
  });
};
print();
