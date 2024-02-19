import Router from "express";
import {
  fetchCategories,
  fetchCategoryNames,
} from "../controllers/CategoryController.js";

const router = Router();

router.get("/fetchCategories/:page?", fetchCategories);
router.get("/fetchCategoryNames", fetchCategoryNames);

export default router;
