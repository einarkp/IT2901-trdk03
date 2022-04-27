import React, { useEffect, useState } from 'react'
import GraphContainer from '../components/GraphContainer'
import Recommended from '../components/Recommended'
import { GraphInfoProps, AllDataApiResponse, schoolData } from '../Interfaces';
import { getData } from '../utils/APIUtils';
import { longMonthFormatter } from "../utils/Formatters"

export default function TotalOversikt() {

  const [oldData, setOldData]: any[] = useState([])
  const [graphData, setGraphData]: any[] = useState([])
  const [infoData, setInfoData]: any[] = useState([])
  const [yearSelectorData, setYearSelectorData] = useState({ allYears: [-1], currentYear: new Date().getFullYear() - 1 })
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  function combineAllDataApiResponse(allData: any) {
    // Combine the response arrays from backend into a format that fits Recharts.
    // This includes creating the cumulative accounting line.
    const combinedDataArr = []
    const accountingArr = allData.Accounting
    const predictionArr = allData.Prediction
    const budget = allData.Budget.length !== 0 ? allData.Budget[0].amount : null
    const budgetChanges = allData.BudgetChange 
    predictionArr.forEach((element: { amount: number; isPrediction: boolean; }) => {  // Need some way of differentiating prediction values
      element.amount = Math.floor(element.amount)
      element.isPrediction = true
    });

    const concatinatedArr = accountingArr.concat(predictionArr)
    const firstPredictionObject = concatinatedArr.find((element: { hasOwnProperty: (arg0: string) => any; }) => element.hasOwnProperty("isPrediction"))
    // Values needed for uncertainty area 
    let currentCumulativeValue = 0
    let currentCumilitaveLowerBound = 0
    let currentCumilitaveUpperBound = 0
    // Values needed for right side info panel:
    let highestValueObject = { amount: Number.NEGATIVE_INFINITY, date: null }  // Aka worst month
    let lowestValueObject = { amount: Number.POSITIVE_INFINITY, date: null }    // Aka best month 
    let length = concatinatedArr.length > 12 ? 12 : concatinatedArr.length
   
    let currentBudget = budget // the current school budget
    let unappliedChanges = budgetChanges // unaplied changes

    for (let index = 0; index < length; index++) {
      const currentAmount = Math.floor(concatinatedArr[index].amount)
      currentCumulativeValue += currentAmount

      const currentLowerBound = Math.floor(concatinatedArr[index].lower_bound)
      const currentUpperBound = Math.floor(concatinatedArr[index].upper_bound)
      if (!isNaN(currentLowerBound) && !isNaN(currentUpperBound)) {
        if (currentCumilitaveLowerBound === 0 && currentCumilitaveUpperBound === 0) {
          currentCumilitaveLowerBound = currentCumulativeValue
          currentCumilitaveUpperBound = currentCumulativeValue
        } else {
          currentCumilitaveLowerBound += currentLowerBound
          currentCumilitaveUpperBound += currentUpperBound
        }
      }

      // applies changes up to current date and removes from unapplied list
      for (const change of unappliedChanges) {
        const date = new Date(change['date'])
        if (date.getMonth() <= index) {
          currentBudget += change['amount']
          unappliedChanges = unappliedChanges.filter(function(el: any) { return el.date != change['date']; })
        }
      }
      
      if (currentAmount > highestValueObject.amount) highestValueObject = concatinatedArr[index]
      if (currentAmount < lowestValueObject.amount) lowestValueObject = concatinatedArr[index]
      const isPrediction = concatinatedArr[index].hasOwnProperty("isPrediction")
      const objectToAdd = {
        school: concatinatedArr[index].school,
        date: new Date(concatinatedArr[index].date),
        accounting: isPrediction ? currentAmount === firstPredictionObject.amount ? currentAmount : null : currentAmount,
        cumulativeAccounting: !isPrediction ? currentCumulativeValue : firstPredictionObject.amount === currentAmount ? currentCumulativeValue : null,
        accountingPrediction: isPrediction ? currentAmount : null,
        cumulativeAccountingPrediction: isPrediction ? currentCumulativeValue : null,
        budget: currentBudget,
        uncertainty: [isPrediction ? Math.floor(concatinatedArr[index].lower_bound) : null, isPrediction ? Math.floor(concatinatedArr[index].upper_bound) : null],
        cumulativeUncertainty: [isPrediction ? currentCumilitaveLowerBound : null, isPrediction ? currentCumilitaveUpperBound : null]
      }
      combinedDataArr.push(objectToAdd)
    }
    

    // update budget based on budget change
    // Set values in right side info panel:
    const highestAccountingMonth = longMonthFormatter(new Date(highestValueObject.date!)).split(" ")[0]
    const LowestAccountingMonth = longMonthFormatter(new Date(lowestValueObject.date!)).split(" ")[0]
    const relativePercentage = Math.floor((currentBudget / currentCumulativeValue) * 100)
    //Checks if it is within fail margin
    const withinMargin = (currentCumilitaveUpperBound - ((currentCumilitaveUpperBound - currentCumulativeValue) / 2)) > currentBudget
    const sidePanelInfo: GraphInfoProps = {
      result: currentBudget > currentCumulativeValue,
      withinMargin: withinMargin,
      resultPercent: relativePercentage,
      bestMonth: lowestValueObject.amount + " (" + LowestAccountingMonth + ")",
      worstMonth: highestValueObject.amount + " (" + highestAccountingMonth + ")",
      maxMonthUse: "..",
    }

    setInfoData(sidePanelInfo)
    return combinedDataArr
  }

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());


    // Get data for yearselector
    if (yearSelectorData.allYears.includes(-1)) {
      getData("getAvailableYears/?schoolid=" + params.id)
        .then((response) => {
          const availableYears = response.data
          setYearSelectorData({ allYears: availableYears, currentYear: availableYears[availableYears.length - 1] })
          setCurrentYear(availableYears[availableYears.length - 1])
        })
        .catch((e) => { console.log(e) });
    }

        getData("all-data?year=" + Number(currentYear - 1) + "&school=" + params.id)
          .then((response) => {
            const AllDataApiResponse: AllDataApiResponse = response.data
            if (AllDataApiResponse.Accounting.length === 0 && AllDataApiResponse.Prediction.length === 0) {
              // TODO: could not find data for specified school id, show some kind of feedback.
              console.log("Found no school with id " + params.id)
            }
            else {
              // response contains 3 arrays (budget, accounting, prediction) that need to be joined:
              setOldData(combineAllDataApiResponse(AllDataApiResponse))
            }
            getData("all-data?year=" + currentYear + "&school=" + params.id)
              .then((response) => {
                const AllDataApiResponse: AllDataApiResponse = response.data
                if (AllDataApiResponse.Accounting.length === 0 && AllDataApiResponse.Prediction.length === 0) {
                  // TODO: could not find data for specified school id, show some kind of feedback.
                  console.log("Found no school with id " + params.id)
                } else {
                  // response contains 3 arrays (budget, accounting, prediction) that need to be joined:
                  setGraphData(combineAllDataApiResponse(AllDataApiResponse))
                }
              })
          })
          .catch((e) => { console.log(e) });
      }, 
      [currentYear]);

  return (<>
    {graphData.length != 0 && <GraphContainer data={graphData} info={infoData} oldData={oldData} setCurrentYear={setCurrentYear} yearSelectorData={yearSelectorData} />}
    <Recommended />
  </>
  )
}
