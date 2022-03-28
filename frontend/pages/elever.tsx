import React, { useEffect, useState } from 'react'
import PupilGraphContainer from '../components/PupilGraphContainer'
import { PupilBackendObject, SemesterSelectorData } from '../Interfaces'
import { getData } from '../utils/APIUtils'

export default function Pupils() {

  const [currentSemester, setCurrentSemester] = useState("")  // A dateString where month is always january (for spring semester) or august (autumn semester), e.g. "Mon Jan 01 2018"
  const [availableSemesters, setAvailableSemesters] = useState<SemesterSelectorData>({ allSemesters: [], currentSemester: "" })
  const [allPupilDataMap, setAllPupilDataMap] = useState(new Map())
  const [maxAmount, setMaxAmount] = useState(0) // Highest amount of pupils found, used to set the domain of the Y-axis so it does not rescale.

  function createAllPupilGraphData(data: any) {
    // Create a Map where key values are date strings (Mon Aug 01 2022 for autumn, Mon Jan 01 2018 for spring), and
    // corresponding values are arrays of objects like this:
    // {pupils: 170, spesped: 1, grade: 8, gradeLabel: "8. Trinn"}
    // this allows easily changing between semesters and getting the corresponding data.
    const availableSemesters: string[] = []
    const allPupilDataMap = new Map();
    let currentMax = 0
    data.forEach((pupilObject: PupilBackendObject) => {
      const year = new Date(pupilObject.year).getFullYear()
      const springDate = pupilObject.spring != 0 ? new Date(year, 0, 1).toDateString() : null
      const autumnDate = pupilObject.autumn != 0 ? new Date(year, 7, 1).toDateString() : null
      if (pupilObject.spring > currentMax) currentMax = pupilObject.spring
      if (pupilObject.autumn > currentMax) currentMax = pupilObject.autumn
      if (springDate != null && !allPupilDataMap.has(springDate)) {
        allPupilDataMap.set(springDate, [{
          pupils: pupilObject.spring,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn"
        }]);
      }
      else if (springDate != null) {
        allPupilDataMap.get(springDate).push({
          pupils: pupilObject.spring,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn"
        });
      }

      if (autumnDate != null && !allPupilDataMap.has(autumnDate)) {
        allPupilDataMap.set(autumnDate, [{
          pupils: pupilObject.autumn,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn"
        }]);
      } else if (autumnDate != null) {
        allPupilDataMap.get(autumnDate).push({
          pupils: pupilObject.autumn,
          spesped: 1, // TODO: add spesped when data exists
          grade: pupilObject.grade,
          gradeLabel: pupilObject.grade + ". Trinn"
        });
      }

      if (springDate != null && !availableSemesters.includes(springDate)) availableSemesters.push(springDate)
      if (autumnDate != null && !availableSemesters.includes(autumnDate)) availableSemesters.push(autumnDate)
    });
    availableSemesters.sort(function (a, b) {
      return new Date(a).getTime() - new Date(b).getTime()
    })
    setMaxAmount(Math.ceil(currentMax / 10) * 10)
    setAvailableSemesters({ allSemesters: availableSemesters, currentSemester: availableSemesters[availableSemesters.length - 1] })
    setCurrentSemester(availableSemesters[availableSemesters.length - 1])
    setAllPupilDataMap(allPupilDataMap)
  }


  useEffect(() => {
    // TODO: get schoolId from logged in user object, do this for "totaloversikt" also
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    getData("schools/" + params.id + "/pupils?year")
      .then((response) => {
        const pupilData = response.data
        createAllPupilGraphData(pupilData)
      })
      .catch((e) => { console.log(e) });
  }, [])


  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {availableSemesters.allSemesters.length != 0 && maxAmount != 0 ?
        <PupilGraphContainer
          data={allPupilDataMap.get(currentSemester)}
          currentSemester={currentSemester}
          semesterSelector={setCurrentSemester}
          semesterSelectorData={availableSemesters}
          maxAmount={maxAmount}
        /> : null}

    </div>
  )
}
