import { format } from 'path';
import React, { FunctionComponent } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { GraphDataProps } from '../Interfaces';
import styles from '../styles/BudgetGraph.module.css'

const dateFormatter = (date: Date) => {
    var day = date.getDate().toString()
    var month = (date.getMonth()+1).toString()
    var year = date.getFullYear().toString()
    return(day + "/" + month + "/" + year)
  };

type IProps = {}

const BudgetGraph = ( {data}:GraphDataProps ) => {
  return (
      <div>
        <ResponsiveContainer width="100%" height={400} aspect={1.2}>
          <LineChart className={styles.chart} data={data} margin={{ top: 20, right: 50, bottom: 0, left: 20 }}>
              <Line strokeWidth="5" type="monotone" dataKey="amount" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" tickFormatter={dateFormatter}/>
              <Tooltip labelFormatter={dateFormatter} />
              <YAxis />
          </LineChart>
        </ResponsiveContainer>
      </div>
  )
}

export default BudgetGraph

