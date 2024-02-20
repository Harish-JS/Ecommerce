import express from "express";
import { configDotenv } from "dotenv";
import productRoutes from "./routes/ProductRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import connection, { checkSolrIndex } from "./db.js";
import cors from "cors";

configDotenv();

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  checkSolrIndex();
  console.log("Connected to MySQL database");
});

const app = express();
const port = process.env.PORT || 5050;

app.use(express.json(), cors());
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);

app.listen(port, () => {
  console.log("Server listening on port : " + port);
});
