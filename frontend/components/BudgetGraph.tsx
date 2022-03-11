import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip, ComposedChart } from 'recharts';
import { DataKey } from 'recharts/types/util/types';
import { GraphDataProps } from '../Interfaces';
import styles from '../styles/BudgetGraph.module.css'
import {shortMonthFormatter, longMonthFormatter, amountFormatter} from "../utils/DateFormaters"



const BudgetGraph = ({ data }: GraphDataProps) => {

  const [hideCumulativeAccounting, setHideCumulativeAccounting] = useState(false);
  const [hideAccounting, setHideAccounting] = useState(false);
  const [hideAccountingPrediction, setHideAccountingPrediction] = useState(false);
  const [hideCumulativeAccountingPrediction, setHideCumulativeAccountingPrediction] = useState(false);
  const [hideBudget, setHideBudget] = useState(false)

  function handleHideLine(e: { dataKey?: DataKey<string>; }) {
    const clickedLegend = e.dataKey
    if (clickedLegend === "cumulativeAccounting") setHideCumulativeAccounting(!hideCumulativeAccounting)
    if (clickedLegend === "accounting") setHideAccounting(!hideAccounting)
    if (clickedLegend === "accountingPrediction") setHideAccountingPrediction(!hideAccountingPrediction)
    if (clickedLegend === "cumulativeAccountingPrediction") setHideCumulativeAccountingPrediction(!hideCumulativeAccountingPrediction)
    if (clickedLegend === "budget") setHideBudget(!hideBudget)
  }

  return (
    <div>
      <ResponsiveContainer height={400} aspect={1.2}>
        <ComposedChart className={styles.chart} data={data} margin={{ top: 20, right: 50, bottom: 0, left: 20 }}>
          <Line strokeWidth="4" type="monotone" dataKey="accounting" stroke="blue" name="Regnskap" hide={hideAccounting} 
            dot={{fill:"blue", r:4}} activeDot={{fill:"blue",stroke:"darkblue",strokeWidth: 3,r:7}}/>

          <Line strokeWidth="4" type="monotone" dataKey="cumulativeAccounting" stroke="red" name="Totalregnskap" hide={hideCumulativeAccounting} 
            dot={{fill:"red",r:4}} activeDot={{fill:"red",stroke:"darkred",strokeWidth: 3,r:7}} />

          <Line strokeWidth="4" type="monotone" dataKey="accountingPrediction" name="Regnskapsprognose" stroke="blue" strokeOpacity="0.6" strokeDasharray="6 1" hide={hideAccounting} 
            dot={{fill:"blue",r:4, opacity:0.6}} activeDot={{fill:"blue",stroke:"darkblue",strokeWidth: 3,r:7}} />

          <Line strokeWidth="4" type="monotone" dataKey="cumulativeAccountingPrediction" name="Totalregnskapsprognose" stroke="red" strokeOpacity="0.6" strokeDasharray="6 1" hide={hideCumulativeAccounting} 
            dot={{fill:"red", r:4, opacity:0.6}} activeDot={{fill:"red",stroke:"darkred",strokeWidth: 3,r:7}}/>

          <Line strokeWidth="3" type="monotone" stroke="black" strokeDasharray="5 5" dataKey={"budget"} name="Budsjett" 
            dot={false} hide={hideBudget}/>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" tickFormatter={shortMonthFormatter} textAnchor="end" />
          <Tooltip labelFormatter={longMonthFormatter} />
          <YAxis tickFormatter={amountFormatter} />
          <Legend verticalAlign="bottom" onClick={handleHideLine} iconType="line" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BudgetGraph

