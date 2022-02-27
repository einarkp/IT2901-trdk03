const fs = require("fs")
const readline = require("readline")
const axios = require("axios")

async function insertToDb(schools) {
  await axios.post('http://127.0.0.1:8000/schools/', {
    schools
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function addSchools() {
  var filePath = "frontend/src/tools/AllSchoolsCsv.csv";

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes("Ansvar;Skole navn;Skole kode")) continue  // skip first line as this includes column names
    const data = line.split(";")  // AllSchoolsCsv.csv is colon separated
    const ansvar = data[0]
    const skoleNavn = data[1]
    const skoleKode = Number(data[2])
    console.log(ansvar, skoleNavn, skoleKode)
    let schools = [
      {
        responsibility: ansvar,
        name: skoleNavn
      }
    ]
    await insertToDb(schools)
  }
}

addSchools()