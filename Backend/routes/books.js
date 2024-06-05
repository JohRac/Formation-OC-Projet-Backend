const express = require("express");
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const sharp = require("../middleware/sharp-config")
const router = express.Router();

const booksCtrl = require("../controllers/books");

//GET 
router.get("/bestrating", booksCtrl.bestRatingBooks)
router.get("/:id", booksCtrl.getOneBook);
router.get("/", booksCtrl.getAllBooks);

//POST
router.post("/", auth, multer, sharp,  booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.ratingBook)

//PUT

router.put("/:id", auth, (req, res, next) => {
    if (req.headers['content-type'].includes('multipart/form-data')) {
        multer(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            sharp(req, res, next);
        });
    } else {
        next();
    }
}, booksCtrl.modifyBook);




//DELETE
router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;


