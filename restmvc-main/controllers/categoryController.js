const express = require('express');
const app = express();
const pool = require("../config");
const Category= require("../models/categories")


app.use(express.json());

exports.index = function (request, response) {
    response.send("Главная страница");
    const category = {
        name: req.body.name,
    }
};


exports.findAll = async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.deleteCategoryByName = async function (request, response) {
    const categoryName = request.params.name; // Get the category name from the route parameters
    let connection;

    try {
        connection = await pool.getConnection();

        // Begin a transaction to ensure atomicity
        await connection.beginTransaction();

        // Step 1: Get the category's ID using its name
        const selectQuery = "SELECT id FROM categories WHERE name = ?";
        const [categoryIdRows] = await connection.execute(selectQuery, [categoryName]);

        if (categoryIdRows.length === 0) {
            // Category not found, return an error response
            await connection.rollback();
            connection.release();
            return response.status(404).json({ error: "Category not found" });
        }

        const categoryId = categoryIdRows[0].id;

        // Step 2: Delete associations in the bookcategory table (assuming such a table exists)

        // Step 3: Delete the category itself
        const deleteCategoryQuery = "DELETE FROM categories WHERE id = ?";
        await connection.execute(deleteCategoryQuery, [categoryId]);

        // Commit the transaction
        await connection.commit();
        connection.release();

        response.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);

        if (connection) {
            await connection.rollback();
            connection.release();
        }

        response.status(500).json({ error: "Internal Server Error" });
    }
};
