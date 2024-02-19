import Router from "express";
import {
  fetchProducts,
  searchProducts,
} from "../controllers/ProductController.js";

const router = Router();

router.get("/fetchProducts/:page?/:id?", fetchProducts);
router.post("/searchProducts", searchProducts);

export default router;
