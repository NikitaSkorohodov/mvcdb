const express = require("express");
const app = express();
const userRouter = require("./routes/booksroutes.js");
const homeRouter = require("./routes/authorsroutes.js");
const categoriesRouter = require("./routes/categoriesroutes.js");
 
app.use("/", userRouter);
app.use("/authors/", homeRouter);
app.use("/categories/", categoriesRouter);
 
app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});
 
app.listen(3000, ()=>console.log("Сервер запущен и ожидает подключения..."));
