import React from 'react'
import { GraphDataProps, Budget } from '../Interfaces'
import ContainerStyle from '../styles/GraphContainer.module.css'
import BudgetGraph from './BudgetGraph'
import { BudgetInfo } from './BudgetInfo'


export default function GraphContainer({data}:GraphDataProps) {
  return (
    <div className={ContainerStyle.container}>
        <div className={ContainerStyle.graph}>
          <BudgetGraph data={data}  />
        </div>
        <div className={ContainerStyle.info}>
          <BudgetInfo />
        </div>
    </div>
  )
}