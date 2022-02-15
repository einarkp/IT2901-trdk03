import React from 'react'
import GraphContainer from '../components/GraphContainer'
import { Budget } from '../Interfaces';

export default function TotalOversikt() {
  return (
    <GraphContainer data={dummyData} />
  )
}


const dummyData: Budget[] = [
  {
      school: 1010,
      date: new Date("2019-01-16"),
      amount: 200,
  },
  {
      school: 1010,
      date: new Date("2019-02-16"),
      amount: 240,
  },
  {
      school: 1010,
      date: new Date("2019-03-16"),
      amount: 260,
  },
  {
      school: 1010,
      date: new Date("2019-04-16"),
      amount: 210,
  },
]