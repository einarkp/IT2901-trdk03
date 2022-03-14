import React from 'react'
import { GraphProps } from '../Interfaces'
import ContainerStyle from '../styles/GraphContainer.module.css'
import BudgetGraph from './BudgetGraph'
import { BudgetInfo } from './BudgetInfo'
import YearSelector from './YearSelector'


export default function GraphContainer({ data, info, setCurrentYear, yearSelectorData}: GraphProps) {
  return (
    <div className={ContainerStyle.container}>
      <div className={ContainerStyle.graph}>
        <BudgetGraph data={data} />
      </div>
      <div className={ContainerStyle.info}>
        <BudgetInfo info={info} />
      </div>
      {/* Place YearSelector under graph... */}
      <YearSelector yearSelector={setCurrentYear} yearSelectorData={yearSelectorData} />
    </div>
  )
}