require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const MONGO_URI = process.env.MONGO_URI;

const booksRoutes = require("./routes/books");

mongoose.connect(MONGO_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true,})
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(bodyParser.json());

app.use("/api/books", booksRoutes);

module.exports = app;
