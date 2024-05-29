const Book = require("../models/Book");
const fs = require("fs");

//GET 

exports.bestRatingBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then(books => {
            if (books.length === 0) {
                res.status(404).json({ message: "Aucun livre trouvé" })
            } else {
                res.status(200).json(books)
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

//POST

exports.createBook = (req, res, next) => {
    console.log("hello")
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    book.save()
        .then(() => res.status(201).json({ message: "Livre enregistré !" }))
        .catch(error => res.status(400).json({ error }));
};

exports.ratingBook = (req, res, next) => {
    const bookNotation = {
        userId: req.auth.userId,
        grade: req.body.rating
    }

    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book) {
                const userAlreadyRated = book.ratings.some(rating => rating.userId === req.auth.userId)
                if (userAlreadyRated) {
                    res.status(400).json({ message: "Vous avez déjà noté ce livre" })
                } else {
                    const currentAverageRating = book.averageRating
                    const newAverageRating = calculateAverageRating(book.ratings.grade, currentAverageRating, book.ratings.length)

                    book.ratings.push(bookNotation)
                    book.averageRating = newAverageRating

                    Book.updateOne({ _id: req.params.id }, { ...bookNotation, _id: req.params.id }, { averageRating: newAverageRating })
                        .then(() => res.status(200).json(book))
                        .catch(error => res.status(405).json({ error }));
                }
            } else {
                res.status(404).json({ message: "Livre introuvable" })
            }
        })
        .catch(error => {
            res.status(410).json({ error });
        });
};

function calculateAverageRating(newNotation, currentAverageRating, numberOfNotations) {

    return (currentAverageRating * numberOfNotations + newNotation) / (numberOfNotations + 1)
}

//PUT

exports.modifyBook = (req, res, next) => {
    console.log("hello")
    const bookObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };
    console.log("2eme")
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "Non-Autorisé" });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Livre modifié !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });

};

//DELETE

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "Non-Autorisé" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Livre supprimé !" }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};