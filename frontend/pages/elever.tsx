import React, { useEffect, useState } from 'react'
import PupilGraphContainer from '../components/PupilGraphContainer'
import { PupilBackendObject, SemesterSelectorData } from '../Interfaces'
import { getData } from '../utils/APIUtils'

export default function Pupils() {

  const [currentSemester, setCurrentSemester] = useState("")  // A dateString where month is always january (for spring semester) or august (autumn semester), e.g. "Mon Jan 01 2018"
  const [availableSemesters, setAvailableSemesters] = useState<SemesterSelectorData>({ allSemesters: [], currentSemester: "" })
  const [allPupilDataMap, setAllPupilDataMap] = useState(new Map()) // See createAllPupilGraphData()
  const [maxAmount, setMaxAmount] = useState(0) // Highest amount of pupils found, used to set the domain of the Y-axis so it does not rescale when changing semesters.

  function refreshData() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    getData("schools/" + params.id + "/pupils") // Get all pupil data for school. 
      .then((response) => {
        const pupilData = response.data
        // Get all budget values for school.
        getData("schools/" + params.id + "/budgets")
          .then((response) => {
            const budgetData = response.data
            createAllPupilGraphData(pupilData, budgetData)
          })
          .catch((e) => { console.log(e) });
      })
      .catch((e) => { console.log(e) });
  }

  function createAllPupilGraphData(pupilData: any, budgetData: any) {
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
          school: pupilObject.school
        }]);
      }
      else if (springDate != null) {
        allPupilDataMap.get(springDate).push({
          pupils: pupilObject.spring,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn",
          budget: budgetObject ? budgetObject.amount : null,
          school: pupilObject.school
        });
      }

      if (autumnDate != null && !allPupilDataMap.has(autumnDate)) {
        allPupilDataMap.set(autumnDate, [{
          pupils: pupilObject.autumn,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn",
          budget: budgetObject ? budgetObject.amount : null,
          school: pupilObject.school
        }]);
      } else if (autumnDate != null) {
        allPupilDataMap.get(autumnDate).push({
          pupils: pupilObject.autumn,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn",
          budget: budgetObject ? budgetObject.amount : null,
          school: pupilObject.school
        });
      }
      if (springDate != null && !availableSemesters.includes(springDate)) availableSemesters.push(springDate)
      if (autumnDate != null && !availableSemesters.includes(autumnDate)) availableSemesters.push(autumnDate)
    });
    availableSemesters.sort(function (a, b) {
      return new Date(a).getTime() - new Date(b).getTime()
    })

    // Check if no data for current/upcoming autumn semester, if so, use prediction values (grade 0 -> last grade-1 of the previous spring semester)
    // TODO: need to calculate new predicted budget based on this when data for value per pupil/spesped exists.
    // Display this value as a predicted budget, which will overwrite the old budget if the user clicks save. 
    const lastIncludedYear = new Date(pupilData[pupilData.length - 1].year).getFullYear()
    const nextAutumnSemester = new Date(lastIncludedYear, 7, 1).toDateString()
    if (!allPupilDataMap.has(nextAutumnSemester)) {
      // Check if we have spring values (and also prediction values)
      if (!allPupilDataMap.has(new Date(lastIncludedYear, 0, 1).toDateString())) return
      const gradeZeroSpringValue = pupilData.find((pupilObject: { grade: number; year: string }) => pupilObject.grade == 0 && pupilObject.year == lastIncludedYear + "-01-01")
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
          school: gradeZeroSpringValue.school
      }])
      // Fill in the rest of the grade values, skip the last grade, as they are no longer in the school
      previousSpringData.forEach((pupilObject: { pupils: number; grade: number; budget: number; school: number }, index: number) => {
        if (index == previousSpringData.length - 1) return  
        allPupilDataMap.get(newAutumnDate).push({
          pupils: pupilObject.pupils,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade+1,
          gradeLabel: pupilObject.grade+1 + ". Trinn",
          budget: pupilObject.budget,
          school: pupilObject.school
        });
      });
      availableSemesters.push(newAutumnDate)
    }

    setMaxAmount(Math.ceil(currentMax / 10) * 10)  // <-- Set a consistent y-axis domain for the pupil graph so that it does not rescale when changing semesters
    setAvailableSemesters({ allSemesters: availableSemesters, currentSemester: availableSemesters[availableSemesters.length - 1] })
    setCurrentSemester(availableSemesters[availableSemesters.length - 1])
    setAllPupilDataMap(allPupilDataMap)
  }

  useEffect(() => {
    // TODO: get schoolId from logged in user object, do this for "totaloversikt" also
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    getData("schools/" + params.id + "/pupils") // Get all pupil data for school. 
      .then((response) => {
        const pupilData = response.data
        // Get all budget values for school.
        getData("schools/" + params.id + "/budgets")
          .then((response) => {
            const budgetData = response.data
            createAllPupilGraphData(pupilData, budgetData)
          })
          .catch((e) => { console.log(e) });

      })
      .catch((e) => { console.log(e) });
  }, [])


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
        /> : null}

    </div>
  )
}
