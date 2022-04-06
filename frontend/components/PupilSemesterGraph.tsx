import React from 'react';
import { CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import styles from '../styles/BudgetGraph.module.css'

const title = "Høst 2022"
const data = [
    {
        grade: '1. Trinn',
        pupils: 70,
        spesped: 3,
    },
    {
        grade: '2. Trinn',
        pupils: 59,
        spesped: 1,
    },
    {
        grade: '3. Trinn',
        pupils: 66,
        spesped: 2,
    },
    {
        grade: '4. Trinn',
        pupils: 70,
        spesped: 3,
    },
    {
        grade: '5. Trinn',
        pupils: 59,
        spesped: 1,
    },
    {
        grade: '6. Trinn',
        pupils: 66,
        spesped: 0,
    },
    {
        grade: '7. Trinn',
        pupils: 70,
        spesped: 3,
    },
];

export default function PupilSemsterGraph(props: { data: any, maxAmount:number }) {  // An alternative approach to displaying this is vertically: https://stackoverflow.com/a/66221135/14953338
    return (
        <div className={styles.container} >
            <ResponsiveContainer height={600} width="100%">
                <BarChart
                    width={400}
                    height={600}
                    data={props.data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    barCategoryGap={25}

                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="gradeLabel" />
                    {/* <YAxis>
                        <Label angle={270} position='left' style={{ textAnchor: 'middle' }}> 
                            Antall elever
                        </Label>
                    </YAxis> */}
                    <YAxis domain={[0, props.maxAmount]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pupils"
                        stackId="a"  // <-- NOTE: to see how the chart will look if not stacked bars simply remove "stackId" property from this component.
                        name="Elever"
                        fill="#5874fc"
                        barSize={30} />

                    <Bar dataKey="spesped" stackId="a" name="Spesped" fill="#54c4fc" />
                </BarChart>

            </ResponsiveContainer>
        </div>
    )
}


