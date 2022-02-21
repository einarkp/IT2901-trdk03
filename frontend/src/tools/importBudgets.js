import fs from 'fs';
import readline from "readline"
import axios from "axios"

async function insertToDb(budget) {
    await axios.post('http://127.0.0.1:8000/schools/' + budget[0].schoolId + '/budgets/', {
        budget
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

var filePath = "frontend/src/tools/Budgets_2021.csv";

const fileStream = fs.createReadStream(filePath);

const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

for await (const line of rl) {
    if (line.includes("Versjon;Ansvar;Beløp;Oppdatert")) continue  // skip first line as this includes column names
    const data = line.split(";")  // Budgets_2021.csv is colon separated'
    const schoolId = Number(data[1])
    const amount = Number(data[2])
    const dateIndexString = data[3].split(".") 
    const toDate = new Date(dateIndexString[2], dateIndexString[1]-1, dateIndexString[0])
    const js_timestamp = toDate.getTime() / 1000;  // send date as ms, then backend --> python_date = datetime.datetime.fromtimestamp(js_timestamp)

    let budget = [
        {
            schoolId: schoolId,
            amount: amount,
            dateMs: js_timestamp 
        }
    ]
    await insertToDb(budget) 
}

export { }