const Excel = require("exceljs")
const axios = require("axios")

// pupilObject = {
//     schoolId: 123,
//     year: 2022,
//     autumn: [123, 12, 143, 12, 123, 123, 123, 0, 0, 0],
//     spring: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// }

async function insertToDb(pupilObject) {
    await axios.post('http://127.0.0.1:8000/schools/' + pupilObject[0].schoolId + '/pupils/', pupilObject)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

const objectsToAddToDb = []

async function addPupils() {
    const filename = "frontend/src/tools/Antall_elever_2018_2022.xlsx"
    const afterAllRows = new Promise((resolve, reject) => {
        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile(filename)
            .then(function () {
                const worksheet = workbook.worksheets[0]
                const lengthOfWorksheet = worksheet.actualRowCount
                worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                    if (row.values.includes("Enhet")) return  // Skip first line
                    const values = row.values
                    // year = index 1
                    // schoolid as string == index 2
                    // Spring values index 4-11, then 12-15
                    // Autumn values index 17-24, then 25-28
                    // If value is null/undefined/empty set to 0.
                    let currentObject = {
                        schoolId: Number(values[2]),
                        year: Number(values[1]),
                    }
                    springValues = values.slice(4, 11).concat(values.slice(12, 15))
                    springValues = Array.from(springValues, v => v === undefined ? 0 : v);  // Handle empty cells, set to 0
                    currentObject.spring = springValues

                    autumnValues = values.slice(17, 24).concat(values.slice(25, 28))
                    autumnValues = Array.from(autumnValues, v => v === undefined ? 0 : v);  // Handle empty cells, set to 0
                    currentObject.autumn = autumnValues
                    objectsToAddToDb.push(currentObject)
                    
                    if (autumnValues.length != 10 || springValues.length != 10) reject("Idiota, row: " + rowNumber)

                    if (rowNumber == lengthOfWorksheet) resolve()
                });
            });
    })
    await afterAllRows.then(async () => {
        for (const object of objectsToAddToDb) {
            await insertToDb([object])
            console.log(object)
          }
    }).catch((error) => {
        console.error(error)
    })
}

// addPupils()

module.exports = {
    addPupils
}