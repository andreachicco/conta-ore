const express = require('express');
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const path = require('path');

const STATUS_CODES = require('../statusCodes');
const dataBase = require('../dataBase');
const { upperCaseFirstLetter, getHourFromMinutes } = require('../helper');

const printsRouter = express.Router();

const { authenticateToken } = require('../middlewares/auth.midlleware');

printsRouter.get('/download/:yearId/:monthId', authenticateToken, async (req, res) => {
    
    const { yearId, monthId } = req.params;

    const selectedYear = await dataBase.getYearById(yearId);

    if(selectedYear) {
        const selectedMonth = selectedYear.year.months.find(month => month._id == monthId);

        const doc = new PDFDocument({size: 'A4'});
        const writeStream = fs.createWriteStream('src/routes/newFile.pdf');
        doc.pipe(writeStream);
        
        createPDF(doc, selectedYear.year.year, selectedMonth);

        writeStream.on('finish', () => {
            const file = path.join(__dirname, 'newFile.pdf');
            res.download(file, (err) => {
                if(err) console.error(err);
            });
        });
    }
    else res.sendStatus(STATUS_CODES.BAD_REQUEST);

});

function createPDF(doc, year, month) {
    const imageSize = {
        width: 70,
        height: 70
    }

    doc
        .image('./src/media/bus.png', { 
            width: imageSize.width,
            height: imageSize.height 
        })
        .font('./src/media/Roboto/Roboto-Bold.ttf')
        .fontSize(13)
        .text(`CONTA ORE STRAORDINARI\nMESE: ${month.name.toUpperCase()}/${year}, ORE TOTALI: ${getHourFromMinutes(month.total_minutes)}\nDATA RILASCIO PDF: ${new Date().toLocaleDateString()}`, imageSize.width * 2.2, imageSize.height + 15);
        
    const dayTable = {
        headers: ["GIORNO", "DA", "A", "ORE TOTALI", "TURNO"],
        rows: [],
    };

    month.days.forEach(day => {
        dayTable.rows.push(createNewRow(day));
    })
          
    doc.text('', 0, 200).table( dayTable );   

    // Finalize PDF file
    doc.end();
}

function createNewRow(day) {
    const newRow = [];

    const date = day.index < 10 ? `0${day.index} - ${upperCaseFirstLetter(day.name)}` : `${day.index} - ${upperCaseFirstLetter(day.name)}`;
    newRow.push(date);

    if(day.extraordinary.total_minutes != 0) {
        newRow.push(day.extraordinary.from);
        newRow.push(day.extraordinary.to);
        newRow.push(getHourFromMinutes(day.extraordinary.total_minutes));

        if(day.extraordinary.number >= 0) newRow.push(day.extraordinary.number);
        else newRow.push('Mezzo Turno');
    }

    return newRow;
}

module.exports = printsRouter;