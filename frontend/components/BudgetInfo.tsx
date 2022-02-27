import React, { useState } from 'react'
import styles from '../styles/BudgetInfo.module.css'
import { GraphInfoProps } from '../Interfaces'

const ResultsPositive = () => (
  <div className={styles.resultPositive}>
    <span className={styles.resultText}>Ja</span> <br />
    <span>Forbruket kan oppjusteres med 12%</span>
  </div>
)
const ResultsNegative = () => (
  <div className={styles.resultNegative}>
    <span className={styles.resultText}>Nei</span> <br />
    <span>Forbruket må nedjusteres med 12%</span>
  </div>
)

export const BudgetInfo = ({info}:any) => {
  return (
    <div className={styles.container}>
      <span>Vil budsjettet gå rundt?</span>
      {info.result ? <ResultsPositive /> : <ResultsNegative />}
      <div className={styles.infoWrap}>
        <div className={styles.infoTexts}>
          <span>Beste måned:</span> <br />
          <span>Værste måned:</span> <br />
          <span>Max månedsbruk:</span> <br />
        </div>
        <div className={styles.infoNumbers}>
          <span>{info.bestMonth}</span>
          <span>{info.worstMonth}</span>
          <span>{info.maxMonthUse}</span>
        </div>
      </div>
    </div>
  )
}
