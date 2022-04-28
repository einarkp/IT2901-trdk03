const fs = require("fs")
const readline = require("readline")
const axios = require("axios")

async function insertToDb(change) {
  await axios.post('http://127.0.0.1:8000/changes/', change)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function addChanges() {
  //requires data to be sorted by year
  var filePath = "frontend/src/tools/changes2018-2022.csv";

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const changes = Array()

  for await (const line of rl) {
    if (line.includes("Versjon;Ansvar;Beløp;Oppdatert")) continue
    const data = line.split(";")
    const school_id = Number(data[1])
    const amount = Number(data[2])
    const version = Number(data[0].substring(0, 4))

    const dateIndexString = data[3].split("/")
    let year = Number(dateIndexString[2])
    let month = Number(dateIndexString[0])

    if (year != version) {
      year = version
      month = 12
    }

    let change = [
      {
        school: school_id,
        amount: amount,
        month: month,
        year: year
      }
    ]

    // change is an json array with only one element, which we need
    change = change[0]

    // checks if a change of same month for a school already exists
    let exists = false

    for (const ch of changes) {
      // checks if a change already exists for given date for given school
      if (change['school'] == ch['school'] && change['year'] == ch['year'] && change['month'] == ch['month']) {
        ch['amount'] += change['amount']
        exists = true
        break
      }
      // stops the loop if not in current year
      if (change.year != ch.year) {
        break
      }
    }
    // adds the change if one at same date didnt exist at beginning of list
    if (!exists) {
      changes.unshift(change)
    }
  }

  await insertToDb(changes)
}

// addChanges()

module.exports = {
  addChanges
}