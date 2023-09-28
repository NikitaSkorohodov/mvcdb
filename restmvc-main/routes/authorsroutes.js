const express = require("express");
const authorsController = require("../controllers/authorsControllers");
const authorsRouter = express.Router();

// http://localhost:3000/search?searchTerm=program


// Corrected route definition for deleting a book by title
authorsRouter.delete("/:name", authorsController.deleteAuthorByName);


module.exports = authorsRouter;