import React, { useEffect, useState } from 'react'
import PupilGraphContainer from '../components/PupilGraphContainer'
import { PupilBackendObject, SemesterSelectorData } from '../Interfaces'
import { getData } from '../utils/APIUtils'

export default function Pupils() {

  const [currentSemester, setCurrentSemester] = useState("")  // A dateString where month is always january (for spring semester) or august (autumn semester), e.g. "Mon Jan 01 2018"
  const [availableSemesters, setAvailableSemesters] = useState<SemesterSelectorData>({ allSemesters: [], currentSemester: "" })
  const [allPupilDataMap, setAllPupilDataMap] = useState(new Map()) // See createAllPupilGraphData()
  const [maxAmount, setMaxAmount] = useState(0) // Highest amount of pupils found, used to set the domain of the Y-axis so it does not rescale when changing semesters.
  const [schoolName, setSchoolName] = useState("")
  const valueOfPupil = 80000
  const valueOfSpesped = 100000

  useEffect(() => {
    refreshData()
  }, [])

  function refreshData() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    getData("schools/" + params.id)
                .then((response) => {
                    const schoolName = response.data.name;
                    setSchoolName(schoolName)
                })
                .catch((e) => { console.log(e) });

    getData("schools/" + params.id + "/pupils") // Get all pupil data for school. 
      .then((response) => {
        const pupilData = response.data
        // Get all budget values for school.
        getData("schools/" + params.id + "/budgets")
          .then((response) => {
            const budgetData = response.data
            getData("schools/" + params.id + "/budgetpredictions")
              .then((response) => {
                const predictedBudgets = response.data
                createAllPupilGraphData(pupilData, budgetData, predictedBudgets)
              })
              .catch((e) => { console.log(e) });
          })
          .catch((e) => { console.log(e) });

      })
      .catch((e) => { console.log(e) });
  }

  function createAllPupilGraphData(pupilData: any, budgetData: any, predictedBudgets: any) {
    // Create a Map where key values are date strings (Mon Aug 01 2022 for autumn, Mon Jan 01 2018 for spring), and
    // corresponding values are arrays of objects like this:
    // {pupils: 170, spesped: 1, grade: 8, gradeLabel: "8. Trinn", budget: 123123123}
    // this allows easily changing between semesters and getting the corresponding data.
    const availableSemesters: string[] = []
    const allPupilDataMap = new Map();
    let currentMax = 0
    pupilData.forEach((pupilObject: PupilBackendObject) => {
      if (pupilObject.grade === 0) return;
      const year = new Date(pupilObject.year).getFullYear()
      const springDate = pupilObject.spring != 0 ? new Date(year, 0, 1).toDateString() : null
      const autumnDate = pupilObject.autumn != 0 ? new Date(year, 7, 1).toDateString() : null
      const budgetObject = budgetData.find((budgetObject: { date: any }) => new Date(budgetObject.date).getFullYear() == year)

      if (pupilObject.spring > currentMax) currentMax = pupilObject.spring
      if (pupilObject.autumn > currentMax) currentMax = pupilObject.autumn
      if (springDate != null && !allPupilDataMap.has(springDate)) {
        allPupilDataMap.set(springDate, [{
          pupils: pupilObject.spring,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn",
          budget: budgetObject ? budgetObject.amount : null,
          predictedBudget: null,
          school: pupilObject.school,
          isPrediction: false
        }]);
      }
      else if (springDate != null) {
        allPupilDataMap.get(springDate).push({
          pupils: pupilObject.spring,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn",
          budget: budgetObject ? budgetObject.amount : null,
          predictedBudget: null,
          school: pupilObject.school,
          isPrediction: false
        });
      }

      if (autumnDate != null && !allPupilDataMap.has(autumnDate)) {
        allPupilDataMap.set(autumnDate, [{
          pupils: pupilObject.autumn,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn",
          budget: budgetObject ? budgetObject.amount : null,
          predictedBudget: null,
          school: pupilObject.school,
          isPrediction: false
        }]);
      } else if (autumnDate != null) {
        allPupilDataMap.get(autumnDate).push({
          pupils: pupilObject.autumn,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn",
          budget: budgetObject ? budgetObject.amount : null,
          predictedBudget: null,
          school: pupilObject.school,
          isPrediction: false
        });
      }
      if (springDate != null && !availableSemesters.includes(springDate)) availableSemesters.push(springDate)
      if (autumnDate != null && !availableSemesters.includes(autumnDate)) availableSemesters.push(autumnDate)
    });
    availableSemesters.sort(function (a, b) {
      return new Date(a).getTime() - new Date(b).getTime()
    })

    // Check if no data for current/upcoming autumn semester, if so, use prediction values (grade 0 -> last grade-1 of the previous spring semester)
    // This only needs to happen until the user clicks "Lagre" (at which is becomes a normal semester, pupil data is set in db), 
    // the idea is that the user can validate the prediction, changing values if needed, then
    // when they click save, a predictedBudget db entry is created, which can be included in "totalOversikt"-graph
    const lastIncludedYear = new Date(availableSemesters[availableSemesters.length - 1]).getFullYear()
    const nextAutumnSemester = new Date(lastIncludedYear, 7, 1).toDateString()
    if (!allPupilDataMap.has(nextAutumnSemester)) {
      // Check if we have spring values (and also prediction values)
      if (!allPupilDataMap.has(new Date(lastIncludedYear, 0, 1).toDateString())) return
      const gradeZeroSpringValue = pupilData.find((pupilObject: { grade: number; year: string }) => pupilObject.grade == 0 && pupilObject.year == lastIncludedYear-1 + "-01-01")  // OBS: notice "lastIncludedYear-1" here
      if (gradeZeroSpringValue === undefined) return
      // Create a new semester with the predicted values
      const newAutumnDate = new Date(lastIncludedYear, 7, 1).toDateString()
      const previousSpringData = allPupilDataMap.get(new Date(lastIncludedYear, 0, 1).toDateString())
      allPupilDataMap.set(newAutumnDate, [{  // set predicted pupil amount for first available grade
        pupils: gradeZeroSpringValue.autumn,
        spesped: 1, // TODO: add spesped when data exists
        grade: previousSpringData[0].grade,
        gradeLabel: previousSpringData[0].grade + ". Trinn",
        budget: previousSpringData[0].budget,
        predictedBudget: null,
        school: gradeZeroSpringValue.school,
        isPrediction: true
      }])
      // Fill in the rest of the grade values, skip the last grade, as they are no longer in the school
      previousSpringData.forEach((pupilObject: { pupils: number; grade: number; budget: number; school: number }, index: number) => {
        if (index == previousSpringData.length - 1) return
        allPupilDataMap.get(newAutumnDate).push({
          pupils: pupilObject.pupils,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade + 1,
          gradeLabel: pupilObject.grade + 1 + ". Trinn",
          budget: pupilObject.budget,
          predictedBudget: null,
          school: pupilObject.school,
          isPrediction: true
        });
      });

      // Calculate and set new predicted budget
      const newPupilAmount = allPupilDataMap.get(newAutumnDate).reduce((accumulator: any, object: { pupils: any }) => {
        return accumulator + object.pupils;
      }, 0);
      const newSpespedAmount = allPupilDataMap.get(newAutumnDate).reduce((accumulator: any, object: { spesped: any }) => {
        return accumulator + object.spesped;
      }, 0);
      allPupilDataMap.get(newAutumnDate).forEach((pupilObject: { predictedBudget: number }) => {
        pupilObject.predictedBudget = newPupilAmount*valueOfPupil + newSpespedAmount*valueOfSpesped
      });
      availableSemesters.push(newAutumnDate)
    }

    // Handle case where user has validated and saved the pupil prediction values, if so a predictedBudget value should exist, which should be shown in both the info panel, 
    // and the pupil form.
    if (allPupilDataMap.has(nextAutumnSemester)) {
      const nextAutumnData = allPupilDataMap.get(nextAutumnSemester)
      let predictedBudget: number = 0
      if (!nextAutumnData[0].isPrediction) {
        const predictedBudgetObject = predictedBudgets.find((predictedBudgetObject: { date: any }) => new Date(predictedBudgetObject.date).getFullYear() == lastIncludedYear)  // This should always exist
        if (predictedBudgetObject === undefined) { 
          // Should never happen "in real life", this means "predicted" pupils have been added, but no predicted budget
          // This does however happen with the current data upload, as the pupil data sheets contain copy pasted values for autumn when only the spring values are real.
          const newPupilAmount = allPupilDataMap.get(nextAutumnSemester).reduce((accumulator: any, object: { pupils: any }) => {
            return accumulator + object.pupils;
          }, 0);
          const newSpespedAmount = allPupilDataMap.get(nextAutumnSemester).reduce((accumulator: any, object: { spesped: any }) => {
            return accumulator + object.spesped;
          }, 0);
          allPupilDataMap.get(nextAutumnSemester).forEach((pupilObject: { predictedBudget: number, isPrediction: boolean }) => {
            pupilObject.predictedBudget = newPupilAmount*valueOfPupil + newSpespedAmount*valueOfSpesped,
            pupilObject.isPrediction = true
          });
        } else {
          predictedBudget = predictedBudgetObject.amount
          allPupilDataMap.get(nextAutumnSemester).forEach((pupilObject: { predictedBudget: number }) => {
            pupilObject.predictedBudget = predictedBudget
          });
        }
      }
    }
    setMaxAmount(Math.ceil(currentMax / 10) * 10)  // <-- Set a consistent y-axis domain for the pupil graph so that it does not rescale when changing semesters
    setAvailableSemesters({ allSemesters: availableSemesters, currentSemester: availableSemesters[availableSemesters.length - 1] })
    setCurrentSemester(availableSemesters[availableSemesters.length - 1])
    setAllPupilDataMap(allPupilDataMap)
  }


  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {availableSemesters.allSemesters.length != 0
        && maxAmount != 0
        && currentSemester != ""
        && allPupilDataMap.size != 0 ?
        <PupilGraphContainer
          data={allPupilDataMap.get(currentSemester)}
          currentSemester={currentSemester}
          semesterSelector={setCurrentSemester}
          semesterSelectorData={availableSemesters}
          maxAmount={maxAmount}
          allPupilDataMap={allPupilDataMap}
          refreshData={refreshData}
          schoolName={schoolName}
        /> : null}

    </div>
  )
}
