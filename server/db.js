import mysql from "mysql";
import { configDotenv } from "dotenv";
import solr from "solr-client";

configDotenv();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const client = solr.createClient({
  host: process.env.SOLR_HOST,
  port: process.env.SOLR_PORT,
  core: process.env.SOLR_CORE,
  protocol: "http",
});

const indexDataIntoSolr = (products) => {
  client.deleteAll();
  products.forEach((product) => {
    client.add(product, () => {
      client.commit(() => {
        console.log(product, "indexed");
      });
    });
  });
};

const fetchDataAndIndex = () => {
  const sql = "SELECT * FROM products";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return;
    }
    indexDataIntoSolr(result);
  });
};

export const checkSolrIndex = async () => {
  // const maxRetries = 10;
  // let retries = 0;
  setTimeout(() => {
    fetchDataAndIndex();
  }, 6000);

  // const retryCheckIndex = async () => {
  //   try {
  //     fetchDataAndIndex();
  //   } catch (error) {
  //     console.error("Error checking Solr index:", error);
  //     retries++;
  //     if (retries < maxRetries) {
  //       console.log(`Retrying (${retries}/${maxRetries})...`);
  //       await new Promise((resolve) => setTimeout(resolve, 5000));
  //       await retryCheckIndex();
  //     } else {
  //       console.error(`Max retries reached. Exiting...`);
  //       process.exit(1);
  //     }
  //   }
  // };

  // await retryCheckIndex();
};

export default connection;
