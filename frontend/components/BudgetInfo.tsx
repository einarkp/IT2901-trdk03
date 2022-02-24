import React from 'react'
import styles from '../styles/BudgetInfo.module.css'

export const BudgetInfo = () => {
  return (
    <div className={styles.container}>
      <span>Vil budsjettet gå rundt?</span>
      <div className={styles.result}></div>
    </div>
  )
}
