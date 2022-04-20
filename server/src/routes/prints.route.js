const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const doc = new PDFDocument();

const STATUS_CODES = require('../statusCodes');
const dataBase = require('../dataBase');
const printsRouter = express.Router();

const { authenticateToken, checkIfAdmin } = require('../middlewares/auth.midlleware');

printsRouter.get('/prints/:yearId/:monthId', authenticateToken, async (req, res) => {
    
    const { yearId, monthId } = req.params;

    const selectedYear = await dataBase.getYearById(yearId);

    if(selectedYear) {
        const selectedMonth = selectedYear.year.months.find(month => month._id == monthId);

        //doc.addPage();
        const writeStream = fs.createWriteStream('src/routes/newFile.pdf');
        doc.pipe(writeStream);
        
        createPDF(selectedMonth);

        writeStream.on('finish', () => {
            const file = path.join(__dirname, 'newFile.pdf');
            res.download(file, function (err) {
                if (err) {
                    console.log("Error");
                    console.log(err);
                } else {
                    console.log("Success");
                }    
            });
        }) 
        //res.sendStatus(STATUS_CODES.OK);
    }
    else res.sendStatus(STATUS_CODES.BAD_REQUEST);

});

function upperCaseFirstLetter(text) {
    return text[0].toUpperCase() + text.slice(1) ;
}

function createPDF(selectedMonth) {

    doc
        .fontSize(20)
        .text(`${upperCaseFirstLetter(selectedMonth.name)} - ${selectedMonth.index}\n\n\n`, 50, 50);
    

    selectedMonth.days.forEach(day => {

        doc.lineWidth(2);
        doc.lineCap('round').stroke();

        const text = `${upperCaseFirstLetter(day.name)} - ${day.index}:\n     From: ${day.extraordinary.from}\n     To: ${day.extraordinary.from}\n     Total Hours: ${getHourFromMinutes(day.extraordinary.total_minutes)}\n\n\n`
        doc
            .fontSize(15) 
            .text(text, 100);
    });

    // Finalize PDF file
    doc.end();
}

function getHourFromMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if(h === 0 && m === 0) return '0';
    else return `${h}:${m}`;
}

module.exports = printsRouter;