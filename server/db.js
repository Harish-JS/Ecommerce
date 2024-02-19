import mysql from "mysql2";
import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

console.log(process.env.MYSQL_HOST);

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
});

const solrUrl = process.env.SOLR_URL;

const indexDataIntoSolr = (data) => {
  axios
    .post(solrUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Data indexed successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error indexing data into Solr:", error);
    });
};

const fetchDataAndIndex = () => {
  const sql = "SELECT * FROM products";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return;
    }
    const solrData = result.map((row) => ({
      id: row.product_id,
      product_name: row.product_name,
      category_id: row.category_id,
      category_name: row.category_name,
      product_brand: row.product_brand,
      mrp: row.mrp,
      discounted_price: row.discounted_price,
      created_date: row.created_date,
    }));
    indexDataIntoSolr(solrData);
  });
};

axios
  .get("http://localhost:8983/solr/mycore/select?q=*:*&rows=1")
  .then((response) => {
    const isDataIndexed = response.data.response.numFound > 0;
    if (!isDataIndexed) {
      fetchDataAndIndex();
    }
  })
  .catch((error) => {
    console.error("Error checking Solr index:", error);
  });

export default connection;
