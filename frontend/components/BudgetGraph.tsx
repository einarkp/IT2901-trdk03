import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip, ComposedChart, Area } from 'recharts';
import { DataKey } from 'recharts/types/util/types';
import { GraphDataProps } from '../Interfaces';
import styles from '../styles/BudgetGraph.module.css'
import {shortMonthFormatter, longMonthFormatter, amountFormatter} from "../utils/DateFormaters"

interface uncertainty {
  school: number;
  date: Date;
  amount: number | null;
  prediction: number | null; 
}


const dummydata = {
  "Accounting": [
    {
      "school": 31040,
      "date": "2022-01-12",
      "amount": 2426016.4346495713
    },
    {
      "school": 31040,
      "date": "2022-02-12",
      "amount": 3006524.046121277
    },
  ],
  "Budget": [
    {
      "school": 31040,
      "date": "2021-02-04",
      "amount": 30476000.0
    }
  ],
  "BudgetChange": [],
  "Prognosis": [],
  "Prediction": [
    {
      "school": 31040,
      "date": "2022-03-12",
      "amount": 2988368.740213417
    },
    {
      "school": 31040,
      "date": "2022-04-12",
      "amount": 2645581.273558945
    },
    {
      "school": 31040,
      "date": "2022-05-12",
      "amount": 1824685.4086115295
    },
    {
      "school": 31040,
      "date": "2022-06-12",
      "amount": 1360669.8196556044
    },
    {
      "school": 31040,
      "date": "2022-07-12",
      "amount": 2654503.7947538886
    },
    {
      "school": 31040,
      "date": "2022-08-12",
      "amount": 3274943.7197576854
    },
    {
      "school": 31040,
      "date": "2022-09-12",
      "amount": 3340776.920716508
    },
    {
      "school": 31040,
      "date": "2022-10-12",
      "amount": 2968126.4624555605
    },
    {
      "school": 31040,
      "date": "2022-11-12",
      "amount": 1540675.787442268
    },
    {
      "school": 31040,
      "date": "2022-12-12",
      "amount": 2038780.100294605
    },
    {
      "school": 31040,
      "date": "2023-01-12",
      "amount": 2038780.100294605
    }
  ],
  "uncertainty": [
    {
      "school": 31040,
      "date": "2022-03-12",
      "amount": [ 1988368.740213417, 3988368.740213417 ] 
    },
    {
      "school": 31040,
      "date": "2022-04-12",
      "amount": [2645581.273558945, 2645581.273558945]
    },
    {
      "school": 31040,
      "date": "2022-05-12",
      "amount": [1824685.4086115295, 1824685.4086115295]
    },
    {
      "school": 31040,
      "date": "2022-06-12",
      "amount": [1360669.8196556044, 1360669.8196556044]
    },
    {
      "school": 31040,
      "date": "2022-07-12",
      "amount": [2654503.7947538886, 2654503.7947538886]
    },
    {
      "school": 31040,
      "date": "2022-08-12",
      "amount": [3274943.7197576854, 3274943.7197576854]
    },
    {
      "school": 31040,
      "date": "2022-09-12",
      "amount": [3340776.920716508, 3340776.920716508]
    },
    {
      "school": 31040,
      "date": "2022-10-12",
      "amount": [2968126.4624555605, 2968126.4624555605]
    },
    {
      "school": 31040,
      "date": "2022-11-12",
      "amount": [1540675.787442268, 1540675.787442268]
    },
    {
      "school": 31040,
      "date": "2022-12-12",
      "amount": [2038780.100294605, 2038780.100294605]
    },
    {
      "school": 31040,
      "date": "2023-01-12",
      "amount": [2038780.100294605, 2038780.100294605]
    }
  ]
}


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

          <Line strokeWidth="4" type="monotone" dataKey="cumulativeAccountingPrediction" name="Total regnskapsprognose" stroke="red" strokeOpacity="0.6" strokeDasharray="6 1" hide={hideCumulativeAccounting} 
            dot={{fill:"red", r:4, opacity:0.6}} activeDot={{fill:"red",stroke:"darkred",strokeWidth: 3,r:7}}/>

          <Line strokeWidth="3" type="monotone" stroke="black" strokeDasharray="5 5" dataKey={"budget"} name="Budsjett" 
            dot={false} hide={hideBudget}/>
          
          <Area type="monotone" dataKey="uncertainty" name="Usikkerhet" stroke="#8884d8" fill="blue" opacity={0.2} hide={hideAccounting}  />

          <Area type="monotone" dataKey="cumulativeUncertainty" name="Total usikkerhet" stroke="#8884d8" fill="red" opacity={0.2} hide={hideCumulativeAccounting} />

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

