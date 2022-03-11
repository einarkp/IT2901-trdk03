const fs = require("fs")
const readline = require("readline")
const axios = require("axios")

// This throws  "NOT NULL constraint failed: schoolbudget_accounting.school_id" for some entries, should figure out why...
// UPDATE: this is because Accounting2018_21Csv.csv contains school ID's not present in AllSchoolsCsv.csv, e.g. 41820 Lianvatnet...

async function insertToDb(accounting) {
    await axios.post('http://127.0.0.1:8000/schools/' + accounting[0].schoolId + '/accountings/', accounting)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function addAccountings() {
    var filePath = "frontend/src/tools/Accounting2018_21Csv.csv";

    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes("Enhet;Måned;År;Regnskap")) continue  // skip first line as this includes column names
        const data = line.split(";")  // Accounting2018_21Csv.csv is colon separated'
        const schoolId = Number(data[0].substring(1, 7))  // <-- sketchy...
        const month = Number(data[1])
        const year = Number(data[2])
        const amount = Number(data[3].replace(/\s/g, ''))
        // Django DateField works like this: d = datetime.date(1997, 10, 19)
        // So we just send the month and year and create the date object backend.

        let accounting = [
            {
                schoolId: schoolId,
                amount: amount,
                month: month,
                year: year
            }
        ]
        await insertToDb(accounting)
    }
}

addAccountings()