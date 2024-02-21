import connection from "../db.js";

export const fetchCategories = async (req, res) => {
  try {
    const page = req.params.page;
    const offset = (page - 1) * 8;
    const query = `SELECT *, (SELECT COUNT(*) FROM categories) as rowCount FROM categories LIMIT 8 OFFSET ${offset}`;
    connection.query(query, (err, result) => {
      if (err) throw err;
      console.log(result);

      res.json({ data: result, count: result[0].rowCount });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const fetchCategoryNames = (req, res) => {
  try {
    const query = "SELECT category_name, category_id FROM categories";
    connection.query(query, (err, result) => {
      if (err) throw err;
      res.json({ data: result });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
