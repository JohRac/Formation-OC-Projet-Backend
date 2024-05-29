const express = require('express');
const fs = require('fs');
const path = require('path');
const Book = require('../models/Book');

const router = express.Router();

router.post('/database', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    await Book.insertMany(data);

    res.status(200).send('Database import" avec succes');
  } catch (error) {
    console.error('Erreur importation database:', error);
    res.status(500).send('Erreur Serveur');
  }
});

module.exports = router;