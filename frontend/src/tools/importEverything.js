const addSchools = require("./importSchools")
const addBudgets = require("./importBudgets")
const addAccountings = require("./importAccounting")
const addChanges = require("./importChanges")
const addPupils = require("./importPupils")
const axios = require("axios")

async function createAllPredictions() {
    await axios.get('http://127.0.0.1:8000/createAllPredictions/')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}


async function importEveryThing() { // Takes some time to run, be patient :)
    await addSchools.addSchools()
    await addSchools.addSchools() // needs to run two times to get similar schools
    await addBudgets.addBudgets()
    await addAccountings.addAccountings()
    await addChanges.addChanges()
    await addPupils.addPupils()
    await createAllPredictions()
    console.log("Done")
}

importEveryThing()
