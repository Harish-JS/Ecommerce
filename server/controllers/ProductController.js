import connection from "../db.js";
import solr from "solr-client";
import pluralize from "pluralize";

export const fetchProducts = async (req, res) => {
  try {
    const page = req.params.page;
    const id = req.params.id;
    const offset = (page - 1) * 8;
    const query = `SELECT *, (SELECT COUNT(*) FROM products ${
      id > 0 ? "WHERE category_id =" + id : ""
    }) as rowCount FROM products ${
      id > 0 ? "WHERE category_id =" + id : ""
    } LIMIT 8 OFFSET ${offset}
`;

    connection.query(query, (err, result) => {
      if (err) throw err;
      res.json({ data: result, count: result[0].rowCount });
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const searchProducts = async (req, res) => {
  const client = solr.createClient({
    host: process.env.SOLR_HOST,
    port: process.env.SOLR_PORT,
    core: process.env.SOLR_CORE,
    protocol: "http",
  });
  try {
    const userQuery = req.body.query.toLowerCase().trim();
    const seperator = [
      " under",
      " above",
      " below",
      " less than",
      " greater than",
      " between",
    ];
    let [term, price] = userQuery.split("under");
    for (let sep of seperator) {
      if (userQuery.includes(sep)) {
        [term, price] = userQuery.split(sep);
      }
    }

    const termSeperator = ["and"];

    let newTerm = term.split(" ");
    for (let sep of termSeperator) {
      if (term.includes(sep)) {
        newTerm = term.split(sep);
      }
    }

    const searchTerm = newTerm
      .map((term) => {
        const Term = pluralize(term, 1).trim();
        return `product_name:*${Term}* OR product_brand:*${Term}* OR category_name:*${Term}*`;
      })
      .join(" OR ");
    let startingPrice = 0;
    let endingPrice = 1000000;
    if (price) {
      if (userQuery.includes("below") || userQuery.includes("under")) {
        endingPrice = parsePrice(price);
      } else {
        startingPrice = parsePrice(price);
      }
    }
    if (userQuery.includes("between") && price.includes("and")) {
      const start = price?.split("and")[0];
      const end = price?.split("and")[1];
      startingPrice = start ? parsePrice(start) : 0;
      endingPrice = end ? parsePrice(end) : 100000;
    }
    let query = client
      .query()
      .q(searchTerm)
      .fq({ field: "mrp", value: `[${startingPrice} TO ${endingPrice}]` })
      .defType("edismax")
      .qf({ product_name: 2, product_brand: 1.5, category_name: 1 });
    let data = await client.search(query);
    res.json({ test: "ok", data: data });
  } catch (err) {
    console.log(err);
  }
};

const parsePrice = (price) => {
  const integerPart = +price?.match(/\d+/)[0];
  const stringPart = price?.match(/[a-z]+/) ? price.match(/[a-z]+/)[0] : "";

  if (stringPart?.includes("k")) {
    return integerPart * 1000;
  }
  return integerPart;
};
