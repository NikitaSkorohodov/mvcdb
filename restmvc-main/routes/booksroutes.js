const express = require("express");
const booksController = require("../controllers/booksController");
const booksRouter = express.Router();

// http://localhost:3000/search?searchTerm=program
booksRouter.get("/search", booksController.searchBooks);

booksRouter.get("/about", booksController.about);
booksRouter.get("/", booksController.index);
booksRouter.get("/booksByAuthor/:authorName", booksController.booksByAuthor);
booksRouter.get('/books/category/:category', booksController.booksByCategory);
booksRouter.get("/categoriesWithBookCount", booksController.categoriesWithBookCount);

// Corrected route definition for deleting a book by title
booksRouter.delete("/:title", booksController.deleteBookByTitle);

module.exports = booksRouter;

