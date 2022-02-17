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
    amount: 2240520,
    prediction: null
  },
  {
    school: 1010,
    date: new Date("2019-02-16"),
    amount: 1932110,
    prediction: null
  },
  {
    school: 1010,
    date: new Date("2019-03-16"),
    amount: 2262200,
    prediction: null
  },
  {
    school: 1010,
    date: new Date("2019-04-16"),
    amount: 2302860,
    prediction: null
  },
  {
    school: 1010,
    date: new Date("2019-05-16"),
    amount: 2269930,
    prediction: null
  },
  {
    school: 1010,
    date: new Date("2019-06-16"),
    amount: -693950,
    prediction: null
  },
  {
    school: 1010,
    date: new Date("2019-07-16"),
    amount: 2007800,
    prediction: null
  },
  {
    school: 1010,
    date: new Date("2019-08-16"),
    amount: 2508580,
    prediction: null
  },
  {
    school: 1010,
    date: new Date("2019-09-16"),
    amount: 2400140,
    prediction: 2400140
  }, {
    school: 1010,
    date: new Date("2019-10-16"),
    amount: null,
    prediction: 2536590
  },
  {
    school: 1010,
    date: new Date("2019-11-16"),
    amount: null,
    prediction: 2816690
  },
  {
    school: 1010,
    date: new Date("2019-12-16"),
    amount: null,
    prediction: 2304870
  }
]