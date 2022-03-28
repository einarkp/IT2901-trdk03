import React, { useEffect, useState } from 'react'
import GraphContainer from '../components/GraphContainer'
import { GraphInfoProps, AllDataApiResponse } from '../Interfaces';
import { getData } from '../utils/APIUtils';
import { longMonthFormatter } from "../utils/DateFormaters"

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
        budget: budget,
        uncertainty: [isPrediction ? Math.floor(concatinatedArr[index].lower_bound) : null, isPrediction ? Math.floor(concatinatedArr[index].upper_bound) : null],
        cumulativeUncertainty: [isPrediction ? currentCumilitaveLowerBound : null, isPrediction ? currentCumilitaveUpperBound : null]
      }
      combinedDataArr.push(objectToAdd)
    }

    // Set values in right side info panel:
    const highestAccountingMonth = longMonthFormatter(new Date(highestValueObject.date!)).split(" ")[0]
    const LowestAccountingMonth = longMonthFormatter(new Date(lowestValueObject.date!)).split(" ")[0]
    const relativePercentage = Math.floor((budget / currentCumulativeValue) * 100)
    //Checks if it is within fail margin
    const withinMargin = (currentCumilitaveUpperBound - ((currentCumilitaveUpperBound - currentCumulativeValue) / 2)) > budget
    const sidePanelInfo: GraphInfoProps = {
      result: budget > currentCumulativeValue,
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
      if (params.id === "example") {
        setOldData(combineAllDataApiResponse(dummyDataApiResponse))
        setGraphData(combineAllDataApiResponse(dummyDataApiResponse))
      }
      else {
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
      }
  }, [currentYear]);

  return (<>
    {graphData.length != 0 && <GraphContainer data={graphData} info={infoData} oldData={oldData} setCurrentYear={setCurrentYear} yearSelectorData={yearSelectorData} />}
  </>
  )
}

// const dummyInfo: GraphInfoProps = {
//   result: true,
//   bestMonth: "-693950 (Juni)",
//   worstMonth: "2816690 (Oktober)",
//   maxMonthUse: "..",
// }

const dummyDataApiResponse = {
  "Accounting": [
    {
      "school": 31040,
      "date": "2022-01-12",
      "amount": 2426016.4346495713
    },
    {
      "school": 31040,
      "date": "2022-02-12",
      "amount": 3006524.046121277
    },
  ],
  "Budget": [
    {
      "school": 31040,
      "date": "2021-02-04",
      "amount": 30476000.0
    }
  ],
  "BudgetChange": [],
  "Prognosis": [],
  "Prediction": [
    {
      "school": 31040,
      "date": "2022-03-12",
      "amount": 2988368.740213417,
      "lower_bound": 2488368.740213417,
      "upper_bound": 3488368.740213417,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-04-12",
      "amount": 2645581.273558945,
      "lower_bound": 2645581.273558945 - 500000,
      "upper_bound": 2645581.273558945 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-05-12",
      "amount": 1824685.4086115295,
      "lower_bound": 1824685.4086115295 - 500000,
      "upper_bound": 1824685.4086115295 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-06-12",
      "amount": 1360669.8196556044,
      "lower_bound": 1324685.4086115295 - 500000,
      "upper_bound": 1324685.4086115295 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-07-12",
      "amount": 2654503.7947538886,
      "lower_bound": 2624685.4086115295 - 500000,
      "upper_bound": 2624685.4086115295 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-08-12",
      "amount": 3274943.7197576854,
      "lower_bound": 3224685.4086115295 - 500000,
      "upper_bound": 3224685.4086115295 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-09-12",
      "amount": 3340776.920716508,
      "lower_bound": 3324685.4086115295 - 500000,
      "upper_bound": 3324685.4086115295 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-10-12",
      "amount": 2968126.4624555605,
      "lower_bound": 2924685.4086115295 - 500000,
      "upper_bound": 2924685.4086115295 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-11-12",
      "amount": 1540675.787442268,
      "lower_bound": 1524685.4086115295 - 500000,
      "upper_bound": 1524685.4086115295 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2022-12-12",
      "amount": 2038780.100294605,
      "lower_bound": 2024685.4086115295 - 500000,
      "upper_bound": 2024685.4086115295 + 500000,
      "coefficient": 0.05
    },
    {
      "school": 31040,
      "date": "2023-01-12",
      "amount": 2038780.100294605,
      "lower_bound": 2024685.4086115295 - 500000,
      "upper_bound": 2024685.4086115295 + 500000,
      "coefficient": 0.05
    }
  ],
}