import React, { useState } from 'react'
import { GraphProps } from '../Interfaces'
import ContainerStyle from '../styles/GraphContainer.module.css'
import BudgetGraph from './BudgetGraph'
import { BudgetInfo } from './BudgetInfo'


export default function GraphContainer({data, info, oldData}:GraphProps) {

  const [currentMonth, setCurrentMonth] = useState(null)

  return (
    <div className={ContainerStyle.container}>
        <div className={ContainerStyle.graph}>
          <BudgetGraph data={data} setCurrentMonth={setCurrentMonth} currentMonth={currentMonth}/>
        </div>
        <div className={ContainerStyle.info}>
          <BudgetInfo info={info} data={data} oldData={oldData} currentMonth={currentMonth}/>
        </div>
    </div>
  )
}