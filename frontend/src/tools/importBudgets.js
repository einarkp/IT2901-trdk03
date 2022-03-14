const fs = require("fs")
const readline = require("readline")
const axios = require("axios")

async function insertToDb(budget) {
    await axios.post('http://127.0.0.1:8000/schools/' + budget[0].schoolId + '/budgets/', budget)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function addBudgets() {
    var filePath = "frontend/src/tools/Budgets2018_2021.csv";

    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes("Dato;Ansvar;Beløp;Oppdatert")) continue  // skip first line as this includes column names
        const data = line.split(";")  // Budgets2018_2021.csv is colon separated
        const schoolId = Number(data[1])
        const amount = Number(data[2])

        const dateIndexString = data[0].split(".")
        const year = Number(dateIndexString[2])

        let budget = [
            {
                schoolId: schoolId,
                amount: amount,
                month: 1,  // Month doesnt matter for budgets, it is year unique
                year: year
            }
        ]
        await insertToDb(budget)
    }
}

addBudgets()