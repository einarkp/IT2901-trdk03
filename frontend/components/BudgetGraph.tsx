import { Switch } from '@mui/material';
import React, { useState } from 'react';
import { Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip, ComposedChart, Area } from 'recharts';
import { DataKey } from 'recharts/types/util/types';
import { combinedBudgetData } from '../Interfaces';
import styles from '../styles/BudgetGraph.module.css'
import {shortMonthFormatter, longMonthFormatter, amountFormatter} from "../utils/Formatters"

export default function BudgetGraph(props: { setCurrentMonth: any, currentMonth: any, data: any, oldData: any}) {

  const [hideCumulativeAccounting, setHideCumulativeAccounting] = useState(false);
  const [hideAccounting, setHideAccounting] = useState(false);
  const [hideCumulativeOldAccounting, setHideCumulativeOldAccounting] = useState(true);
  const [hideOldAccounting, setHideOldAccounting] = useState(true);
  const [hideAccountingPrediction, setHideAccountingPrediction] = useState(false);
  const [hideCumulativeAccountingPrediction, setHideCumulativeAccountingPrediction] = useState(false);
  const [hideBudget, setHideBudget] = useState(false)
  

  function handleHideLine(e: { dataKey?: DataKey<string>; }) {
    const clickedLegend = e.dataKey
    if (clickedLegend === "cumulativeAccounting") setHideCumulativeAccounting(!hideCumulativeAccounting)
    if (clickedLegend === "accounting") setHideAccounting(!hideAccounting)
    if (clickedLegend === "cumulativeOldAccounting") setHideCumulativeOldAccounting(!hideCumulativeOldAccounting)
    if (clickedLegend === "oldAccounting") setHideOldAccounting(!hideOldAccounting)
    if (clickedLegend === "accountingPrediction") setHideAccountingPrediction(!hideAccountingPrediction)
    if (clickedLegend === "cumulativeAccountingPrediction") setHideCumulativeAccountingPrediction(!hideCumulativeAccountingPrediction)
    if (clickedLegend === "budget") setHideBudget(!hideBudget)
  }

  function toggleClick(month: any) {
    if (month == props.currentMonth) {
      props.setCurrentMonth(null)
    } else {
      props.setCurrentMonth(month)
    }
  }
  
  //Combines data from last year with data from current year
  function combineData(data: any, oldData: any){
    let combinedData: combinedBudgetData[] = []
    for (var i = 0; i < data.length; i++) {
      let combinedDataMonth: combinedBudgetData = {
        school: data[i].school,
        date: data[i].date,
        accounting: data[i].accounting,
        oldAccounting: oldData[i].accounting,
        cumulativeAccounting: data[i].cumulativeAccounting,
        cumulativeOldAccounting: oldData[i].cumulativeAccounting,
        accountingPrediction: data[i].accountingPrediction,
        cumulativeAccountingPrediction: data[i].cumulativeAccountingPrediction,
        budget: data[i].budget,
        oldBudget: oldData[i].budget,
        uncertainty: data[i].uncertainty,
        cumulativeUncertainty: data[i].cumulativeUncertainty,
      }
      combinedData.push(combinedDataMonth)
    }
    return combinedData
  }

  const combinedData = combineData(props.data, props.oldData)

  function showPreviousYear() {
    setHideCumulativeOldAccounting(!hideCumulativeOldAccounting)
    setHideOldAccounting(!hideCumulativeOldAccounting)
  }

  return (
    <div className={styles.container}>
      <div style={{position: "absolute", top:"140px", display:"flex", alignItems:"baseline"}}>
        <span>Vis fjoråret</span>
      <Switch onClick={showPreviousYear}/>
      </div>

      <ResponsiveContainer height={600} width="100%">
        <ComposedChart className={styles.lineChart} data={combinedData} margin={{ top: 20, right: 20, bottom: 0, left: 20 } }>

          {/* Uncertainty areas */}
          <Area type="monotone" dataKey="uncertainty" name="Usikkerhet" stroke="#8884d8" fill="blue" opacity={0.2} hide={hideAccounting}  />
          <Area type="monotone" dataKey="cumulativeUncertainty" name="Total usikkerhet" stroke="#8884d8" fill="red" opacity={0.2} hide={hideCumulativeAccounting} />

          {/* Old accounting */}
          <Line strokeWidth="2.5" type="monotone"  dataKey="oldAccounting" stroke="blue" strokeOpacity="0.4" name="Fjorårets Regnskap" hide={hideOldAccounting} dot={false} activeDot={false}/>
          <Line strokeWidth="2.5" type="monotone" dataKey="cumulativeOldAccounting" stroke="red" strokeOpacity="0.4" name="Fjorårets Totalregnskap" hide={hideCumulativeOldAccounting} dot={false} activeDot={false}/>

          {/* Current Accounting */}
          <Line strokeWidth="2.5" type="monotone" dataKey="accounting" stroke="#0099cc" name="Regnskap" hide={hideAccounting} 
            dot={{fill:"blue", r:4}} activeDot={{fill:"#0099cc",stroke:"blue",strokeWidth: 3,r:7, cursor: "pointer",onClick: (event, payload) => toggleClick((payload as any).index)}}/>
          <Line strokeWidth="2.5" type="monotone" dataKey="cumulativeAccounting" stroke="#ff6600" name="Totalregnskap" hide={hideCumulativeAccounting} 
            dot={{fill:"red",r:4}} activeDot={{fill:"red",stroke:"darkred",strokeWidth: 3,r:7, cursor: "pointer",onClick: (event, payload) => toggleClick((payload as any).index)}} />
          
          {/* Accounting prediction */}
          <Line strokeWidth="2.5" type="monotone" dataKey="accountingPrediction" name="Regnskapsprognose" stroke="#0099cc" strokeOpacity="0.6" strokeDasharray="6 3" hide={hideAccounting} 
            dot={{fill:"blue",r:4, opacity:0.6}} activeDot={{fill:"blue",stroke:"darkblue",strokeWidth: 3,r:7, cursor: "pointer",onClick: (event, payload) => toggleClick((payload as any).index)}} />
          
          <Line strokeWidth="2.5" type="monotone" dataKey="cumulativeAccountingPrediction" name="Total regnskapsprognose" stroke="#ff6600" strokeOpacity="0.6" strokeDasharray="6 3" hide={hideCumulativeAccounting} 
            dot={{fill:"#ff6600", r:4, opacity:0.6}} activeDot={{fill:"red",stroke:"darkred",strokeWidth: 3,r:7, cursor: "pointer",onClick: (event, payload) => toggleClick((payload as any).index)}}/>
          
          {/* Budget */}
          <Line strokeWidth="2" type="stepAfter" stroke="black" strokeDasharray="5 5" dataKey={"budget"} name="Budsjett" 
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


