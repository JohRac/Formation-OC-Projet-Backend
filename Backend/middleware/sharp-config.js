const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '../images', req.file.filename);
        const outputFilePath = path.join(__dirname, '../images', `${req.file.filename.split('.')[0]}.webp`);

        await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(outputFilePath);


        fs.unlinkSync(filePath);

        req.file.filename = `${req.file.filename.split('.')[0]}.webp`;
        next();
    } catch (error) {
        res.status(500).send({ error });
    }
};