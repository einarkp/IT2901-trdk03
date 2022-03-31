import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { spawn } from 'child_process'
import React, { useEffect, useState } from 'react'
import { PercentageProps } from '../Interfaces'
import styles from '../styles/BudgetInfo.module.css'
import { longMonthFormatter, splitAmountFormatter, percentChange, singleDecimalFormatter } from '../utils/Formatters'


export const BudgetInfo = ({ data, info, oldData, currentMonth }: any) => {
  let percentage = 100
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

  // Element displaying up ur down arrow with percentage e.g. (up arrow) 17%
  const PercentageElement = (props:{percent: number}) => {
    if (props.percent >= 0){
      return <span className={styles.percentagePositive}> <CaretUpOutlined style={{ color: 'green' }} />{singleDecimalFormatter(props.percent)}%</span>
    } else if(-5 > props.percent){
      return <span className={styles.percentageNegative}> <CaretDownOutlined style={{ color: 'red' }}/>{singleDecimalFormatter(props.percent)}%</span>
    } else{
      return <span className={styles.percentageMedium}> <CaretDownOutlined style={{ color: "rgb(217, 190, 0)" }} />{singleDecimalFormatter(props.percent)}%</span>
    }
  }


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

  const [accountingPercent, setAccountingPercent] = useState(Number)
  const [cumulativeAccountingPercent, setCumulativeAccountingPercent] = useState(Number)
  const [budgetPercent, setBudgetPercent] = useState(Number)
  // const [displayMonth, setDisplayMonth] = useState("...")
  const [previousDisplayMonth, setPreviousDisplayMonth] = useState("...")

  // Updates data when month changes
  // Currently, if a month is selected only the top part of the side panels values are updated if you change the year.
  // This allows "locking-in" a previous value you might want to compare, but could also just automatically update both parts when changing year.
  useEffect(() => {
    if (currentMonth != null) {
      const year = data[currentMonth].date.getFullYear()
      const date = new Date(year, currentMonth, 1)
      const prevDate = new Date(year - 1, currentMonth, 1)
      // setDisplayMonth(longMonthFormatter(date)) 
      setPreviousDisplayMonth(longMonthFormatter(prevDate))
      if (oldData.length != 0) {
        setPreviousAccounting(String(splitAmountFormatter(oldData[currentMonth].accounting)))
        setPreviousCumulativeAccounting(String(splitAmountFormatter(oldData[currentMonth].cumulativeAccounting)))
        setPreviousBudget(String(splitAmountFormatter(oldData[currentMonth].budget)))

        //Percentages
        //Calculated with formula ((NewValue - PrevValue)/PrevValue)*100
        let accPercent = percentChange(oldData[currentMonth].accounting, data[currentMonth].accounting)
        setAccountingPercent(accPercent)
        let cumAccPercent = percentChange(oldData[currentMonth].cumulativeAccounting, data[currentMonth].cumulativeAccounting)
        setCumulativeAccountingPercent(cumAccPercent)
        let budPercent = percentChange(oldData[currentMonth].budget, data[currentMonth].budget)
        setBudgetPercent(budPercent)
      }
    }
  }, [currentMonth])


  const DetailedTable = () => (
    <div>
      <table className={styles.infoTable}>
        <tbody>
          <tr className={styles.displayedMonth}>{longMonthFormatter(new Date(data[currentMonth].date.getFullYear(), currentMonth, 1))}</tr>
          <tr>
            <td>{prediction ? <span>Regnskapsprognose</span> : <span>Regnskap</span>}</td>
            <td>{prediction 
            ? splitAmountFormatter(data[currentMonth].accountingPrediction)
            : splitAmountFormatter(data[currentMonth].accounting)
            }</td>
            <td>{prediction 
            ? <PercentageElement percent={accountingPercent} />
            : <PercentageElement percent={accountingPercent}/>
            }</td>
          </tr>
          <tr>
            <td>{prediction ? <span>Totalregnskapsprognose</span> : <span>Totalregnskap</span>}</td>
            <td>{prediction 
            ? splitAmountFormatter(data[currentMonth].cumulativeAccountingPrediction)
            : splitAmountFormatter(data[currentMonth].cumulativeAccounting)
            }</td>
            <td>{prediction 
            ? <PercentageElement percent={cumulativeAccountingPercent} />
            : <PercentageElement percent={cumulativeAccountingPercent}/>
            }</td>
          </tr>
          <tr>
            <td>Budsjett</td>
            <td>
              {splitAmountFormatter(data[currentMonth].budget)}
            </td>
            <td>
              <PercentageElement percent={budgetPercent} />
            </td>
          </tr>
          <tr>
            <td>Elever</td>
            <td>{/*TODO: ADD ELEV DATA*/}...</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table className={styles.infoTable}>
        <tbody>
          <tr className={styles.displayedMonth}>
            {previousDisplayMonth}
          </tr>
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
    </div>
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
