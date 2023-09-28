const express = require("express");
const categoriesController = require("../controllers/categoryController");
const router = express.Router();

// Define routes for categories
router.get("/", categoriesController.findAll);

// Delete a category by name
router.delete("/:name", categoriesController.deleteCategoryByName);

module.exports = router;
