const express = require('express');
const app = express();
const pool = require("../config"); 

app.use(express.json());
exports.index = function (request, response) {
    response.send("Главная страница");
};



exports.about = async function (request, response) {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT title FROM books');
        connection.release();
        response.json(rows); 
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' }); 
    }
};
exports.searchBooks = async function (request, response) {
    const searchTerm = request.query.searchTerm; // Получаем искомое слово из запроса

    try {
        const connection = await pool.getConnection();
        const query = 'SELECT title FROM books WHERE title LIKE ?'; // Используем оператор LIKE
        const [rows, fields] = await connection.execute(query, [`%${searchTerm}%`]); // Используем % для поиска совпадений в любой части названия
        connection.release();
        response.json(rows);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.booksByAuthor = async function (request, response) {
    const authorName = request.params.authorName; // Get the author's name from the route parameters

    try {
        const connection = await pool.getConnection();

        // Execute the SQL query to retrieve all book titles by the author
        const query = `
            SELECT books.title
            FROM books
            INNER JOIN bookauthor ON books.id = bookauthor.BookId
            INNER JOIN authors ON bookauthor.AuthorId = authors.id
            WHERE authors.name = ?;
        `;

        const [rows, fields] = await connection.execute(query, [authorName]);
        connection.release();

        // Extract the titles from the result
        const titles = rows.map(row => row.title);
        
        response.json(titles);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.booksByCategory = async function (request, response) {
    const category = request.params.category; // Получите категорию из параметров маршрута

    try {
        const connection = await pool.getConnection();

        // Выполните SQL-запрос, чтобы выбрать все книги в определенной категории
        const query = `
            SELECT books.title
            FROM books
            INNER JOIN bookcategory ON books.id = bookcategory.BookId
            INNER JOIN categories ON bookcategory.CategoryId = categories.id
            WHERE categories.name = ?;
        `;

        const [rows, fields] = await connection.execute(query, [category]);
        connection.release();

        // Извлеките названия книг из результата
        const titles = rows.map(row => row.title);

        response.json(titles);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.categoriesWithBookCount = async (request, response) => {
    try {
      const connection = await pool.getConnection();
      const [rows, fields] = await connection.query(`
        SELECT categories.category_name, COUNT(books.id) AS book_count
        FROM categories
        LEFT JOIN books ON categories.id = books.category_id
        GROUP BY categories.id
      `);
      connection.release();
      response.json(rows);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  };
  exports.deleteBookByTitle = async function (request, response) {
    const bookTitle = request.params.title; // Get the book title from the route parameters

    try {
        const connection = await pool.getConnection();

        // Begin a transaction to ensure atomicity
        await connection.beginTransaction();

        // Step 1: Get the book's ID using its title
        const selectQuery = "SELECT id FROM books WHERE title = ?";
        const [bookIdRows] = await connection.execute(selectQuery, [bookTitle]);

        if (bookIdRows.length === 0) {
            // Book not found, return an error response
            await connection.rollback();
            connection.release();
            return response.status(404).json({ error: "Book not found" });
        }

        const bookId = bookIdRows[0].id;

        // Step 2: Delete associations in the bookauthor table
        const deleteAssociationsQuery = "DELETE FROM bookauthor WHERE BookId = ?";
        await connection.execute(deleteAssociationsQuery, [bookId]);

        // Step 3: Delete the book itself
        const deleteBookQuery = "DELETE FROM books WHERE id = ?";
        await connection.execute(deleteBookQuery, [bookId]);

        // Commit the transaction
        await connection.commit();
        connection.release();

        response.json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error(error);

        // Rollback the transaction in case of an error
        await connection.rollback();
        connection.release();

        response.status(500).json({ error: "Internal Server Error" });
    }
};
