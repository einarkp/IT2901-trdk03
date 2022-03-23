import { spawn } from 'child_process'
import React, { useEffect, useState } from 'react'
import styles from '../styles/BudgetInfo.module.css'
import { longMonthFormatter } from '../utils/DateFormaters'


export const BudgetInfo = ({ data, info, oldData, currentMonth }: any) => {
  let percentage = 100
  console.log(data[4])
  if (info.resultPercent < 100) {
    percentage = 100 - info.resultPercent
  } else {
    percentage = info.resultPercent - 100
  }
  const ResultsPositive = () => (
    <div className={styles.resultPositive}>
      <span className={styles.resultText}>Ja</span> <br />
      <span>Forbruket kan oppjusteres med {percentage}%</span>
    </div>
  )
  const ResultsNegative = () => (
    <div className={styles.resultNegative}>
      <span className={styles.resultText}>Nei</span> <br />
      <span>Forbruket må nedjusteres med {percentage}%</span>
    </div>
  )
  const ResultsBetween = () => (
    <div className={styles.resultBetween}>
      <span className={styles.resultText}>Tja..</span> <br />
      <span>Forbruket kan oppjusteres med {percentage}%</span>
    </div>
  )


  // toggles between normal view and detail view, as well as accountings and predictions
  let prediction = false
  let normalView = false
  
  if (currentMonth == null) {
    normalView = true
  }
  if (!normalView && data[currentMonth].accounting == null) {
    prediction = true
  }


  const [previousAccounting, setPreviousAccounting] = useState("...")
  const [previousCumulativeAccounting, setPreviousCumulativeAccounting] = useState("...")
  const [previousBudget, setPreviousBudget] = useState("...")
  const [displayMonth, setDisplayMonth] = useState("...")
  const [previousDisplayMonth, setPreviousDisplayMonth] = useState("...")
  
  // updates data when month changes
  useEffect(() => {
    if (currentMonth != null) {
      const year = data[currentMonth].date.getFullYear()
      const date = new Date(year, currentMonth, 1)
      const prevDate = new Date(year-1, currentMonth, 1)
      setDisplayMonth(longMonthFormatter(date))
      setPreviousDisplayMonth(longMonthFormatter(prevDate))
      if (oldData.length != 0) {
        setPreviousAccounting(oldData[currentMonth].accounting)
        setPreviousCumulativeAccounting(oldData[currentMonth].cumulativeAccounting)
        setPreviousBudget(oldData[currentMonth].budget)
      }
    }
  }, [currentMonth])


  const DetailedTable = () => (
    <table className={styles.infoTable}>
      <thead>
        {displayMonth}
      </thead>
      <tbody>
        <tr>
          <td>{prediction ? <span>Regnskapsprognose</span> : <span>Regnskap</span>}</td>
          <td>{prediction ? data[currentMonth].accountingPrediction : data[currentMonth].accounting}</td>
        </tr>
        <tr>
          <td>{prediction ? <span>Totalregnskapsprognose</span> : <span>Totalregnskap</span>}</td>
          <td>{prediction ? data[currentMonth].cumulativeAccountingPrediction : data[currentMonth].cumulativeAccounting}</td>
        </tr>
        <tr>
          <td>Budsjett</td>
          <td>{data[currentMonth].budget}</td>
        </tr>
        <tr>
          <td>Elever</td>
          <td>{/*TODO: ADD ELEV DATA*/}...</td>
        </tr>
        <thead>
          {previousDisplayMonth}
        </thead>
        <tr>
          <td>Regnskap</td>
          <td>{previousAccounting}</td>
        </tr>
        <tr>
          <td>Totalregnskap</td>
          <td>{previousCumulativeAccounting}</td>
        </tr>
        <tr>
          <td>Budsjett</td>
          <td>{previousBudget}</td>
        </tr>
        <tr>
          <td>Elever</td>
          <td>{/*TODO: ADD ELEV DATA*/}...</td>
        </tr>
      </tbody>
    </table>
  )

  const InfoTable = () => (
    <table className={styles.infoTable}>
      <tbody>
        <tr>
          <td>Beste måned:</td>
          <td>{info.bestMonth}</td>
        </tr>
        <tr>
          <td>Verste måned:</td>
          <td>{info.worstMonth}</td>
        </tr>
        <tr>
          <td>Max månedsbruk:</td>
          <td>{info.maxMonthUse}</td>
        </tr>
      </tbody>
    </table>
  )

  return (
    <div className={styles.container}>
      <span className={styles.topText}>Vil budsjettet gå rundt?</span>
      {info.result ? (info.withinMargin ? <ResultsBetween /> : <ResultsPositive />) : <ResultsNegative />}

      {normalView ? <InfoTable /> : <DetailedTable />}
    </div>
  )
}
