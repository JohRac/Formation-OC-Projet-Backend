// const Book = require("../models/Book.js")
// const fs = require("fs")

// fs.readFile('data.json', 'utf8', (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     const jsonData = JSON.parse(data);

//     jsonData.forEach(bookData => {
//         const book = new Book({
//             userId: bookData.userId,
//             title: bookData.title,
//             author: bookData.author,
//             imageUrl: bookData.imageUrl,
//             year: bookData.year,
//             genre: bookData.genre,
//             ratings: [
//                 {
//                     userId: bookData.userId,
//                     grade: bookData.grade,
//                 }
//             ],
//             averageRating: bookData.averageRating,
//         });

//         book.save((err) => {
//             if (err) {
//                 console.error(err);
//                 return;
//             }
//             console.log('Livre importé avec succès :', bookData.title);
//         });
//     });
// });


const express = require('express');
const fs = require('fs');
const path = require('path');
const Book = require('../models/Book');

const router = express.Router();

// Route to populate the database
router.post('/database', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Insert data into the database
    await Book.insertMany(data);

    res.status(200).send('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;