import { format } from 'path';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { DataKey } from 'recharts/types/util/types';
import { GraphDataProps, TotalBudgetData } from '../Interfaces';
import styles from '../styles/BudgetGraph.module.css'

const shortMonthFormatter = (date: Date) => { // Formats to short month name, e.g. "Nov", "Jun", "Okt"
  const formatter = new Intl.DateTimeFormat('no', { month: 'short' });
  const shortDateName = formatter.format(date);
  return shortDateName.charAt(0).toUpperCase() + shortDateName.slice(1)
};

const longMonthFormatter = (date: Date) => { // Formats to long month name, e.g. "November", "Juni"
  const formatter = new Intl.DateTimeFormat('no', { month: 'long' });
  const longDateName = formatter.format(date);
  return longDateName.charAt(0).toUpperCase() + longDateName.slice(1) + " " + date.getFullYear()
}

const amountFormatter = (amount: number) => {  // Formats number to compact, e.g. 2413560 --> "2,4 mill."
  const formatter = Intl.NumberFormat('no', { notation: 'compact' });
  return formatter.format(amount)
}

type IProps = {}

const BudgetGraph = ({ data }: GraphDataProps) => {

  const [hideBudget, setHideBudget] = useState(false);
  const [hideAmount, setHideAmount] = useState(false);
  const [hideAmountPrediction, setHideAmountPrediction] = useState(false);

  function createTotalBudgetData() {
    // Reformat data to include additional value "budget", which is the incremental sum of "amount" along the year. 
    // This forms the total budget.
    let currentRealBudgetSum = 0;
    const totalBudgetData: TotalBudgetData[] = [];
    data.forEach(element => {
      if (element.amount == null && element.prediction == null) throw "Both amount and prediction is null, at least one of them has to have a valid value"
      currentRealBudgetSum += (element.amount ? element.amount! : element.prediction!)
      totalBudgetData.push(
        {
          school: element.school,
          date: element.date,
          amount: element.amount,
          budget: currentRealBudgetSum,
          amountPrediction: element.prediction,
          budgetPrediction: null
        }
      )
    });
    return totalBudgetData
  }

  function handleHideLine(e: { dataKey?: DataKey<string>; }) {
    const clickedLegend = e.dataKey
    if (clickedLegend === "budget") setHideBudget(!hideBudget)
    if (clickedLegend === "amount") setHideAmount(!hideAmount)
    if (clickedLegend === "amountPrediction") setHideAmountPrediction(!hideAmountPrediction)
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={400} aspect={1.2}>
        <LineChart className={styles.chart} data={createTotalBudgetData()} margin={{ top: 20, right: 50, bottom: 0, left: 20 }}>
          <Line strokeWidth="5" type="monotone" dataKey="amount" stroke="blue" hide={hideAmount}/>
          <Line strokeWidth="5" type="monotone" dataKey="budget" stroke="red"  hide={hideBudget} />
          <Line strokeWidth="5" type="monotone" dataKey="amountPrediction" stroke="purple" strokeDasharray="5 5" hide={hideAmountPrediction}/>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" tickFormatter={shortMonthFormatter} textAnchor="end" />
          <Tooltip labelFormatter={longMonthFormatter} />
          <YAxis tickFormatter={amountFormatter} />
          <Legend verticalAlign="bottom" onClick={handleHideLine} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BudgetGraph

