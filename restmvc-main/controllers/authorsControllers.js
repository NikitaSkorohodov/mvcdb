const express = require('express');
const app = express();
const pool = require("../config"); 

app.use(express.json());

exports.index = function (request, response) {
    response.send("Главная страница");
};

exports.deleteAuthorByName = async function (request, response) {
    const authorName = request.params.name; // Get the author's name from the route parameters
    let connection;

    try {
        connection = await pool.getConnection();

        // Begin a transaction to ensure atomicity
        await connection.beginTransaction();

        // Step 1: Get the author's ID using their name
        const selectQuery = "SELECT id FROM authors WHERE name = ?";
        const [authorIdRows] = await connection.execute(selectQuery, [authorName]);

        if (authorIdRows.length === 0) {
            // Author not found, return an error response
            await connection.rollback();
            connection.release();
            return response.status(404).json({ error: "Author not found" });
        }

        const authorId = authorIdRows[0].id;

        // Step 2: Delete associations in the bookauthor table
        const deleteAssociationsQuery = "DELETE FROM bookauthor WHERE AuthorId = ?";
        await connection.execute(deleteAssociationsQuery, [authorId]);

        // Step 3: Delete the author itself
        const deleteAuthorQuery = "DELETE FROM authors WHERE id = ?";
        await connection.execute(deleteAuthorQuery, [authorId]);

        // Commit the transaction
        await connection.commit();
        connection.release();

        response.json({ message: "Author deleted successfully" });
    } catch (error) {
        console.error(error);

        if (connection) {
            // Rollback the transaction in case of an error
            await connection.rollback();
            connection.release();
        }

        response.status(500).json({ error: "Internal Server Error" });
    }
};
