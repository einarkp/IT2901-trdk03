import React, { useState } from 'react'
import styles from '../styles/BudgetInfo.module.css'


export const BudgetInfo = ({info}:any) => {
  let percentage = 100
  if(info.resultPercent < 100){
     percentage = 100 - info.resultPercent
  } else{
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
  
  return (
    <div className={styles.container}>
      <span className={styles.topText}>Vil budsjettet gå rundt?</span>
      {info.result ? (info.withinMargin ? <ResultsBetween /> : <ResultsPositive />) : <ResultsNegative />}

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
    </div>
  )
}
