const express = require("express");
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const sharp = require("../middleware/sharp-config")
const router = express.Router();

const booksCtrl = require("../controllers/books");

router.post("/", auth, multer, sharp,  booksCtrl.createBook);
router.put("/:id", auth, multer, sharp,  booksCtrl.modifyBook);
router.delete("/:id",auth, booksCtrl.deleteBook);
router.get("/:id", booksCtrl.getOneBook);
router.get("/", booksCtrl.getAllBook);

module.exports = router;