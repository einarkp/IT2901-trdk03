import React from 'react';
import { CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip, BarChart, Bar, Label } from 'recharts';
import styles from '../styles/BudgetGraph.module.css'

export default function PupilSemsterGraph(props: { data: any, maxAmount: number, isPrediction: boolean }) {  // An alternative approach to displaying this is vertically: https://stackoverflow.com/a/66221135/14953338
    const PredictionBar = (props: { x: number; y: number; width: number; height: number; fill: string; }) => {
        const {
            x: oX,
            y: oY,
            width: oWidth,
            height: oHeight,
            fill
        } = props;
        let x = oX;
        let y = oHeight < 0 ? oY + oHeight : oY;
        let width = oWidth;
        let height = Math.abs(oHeight);

        return (
            <svg>
                <rect fill={fill}
                    mask='url(#mask-stripe)'
                    x={x}
                    y={y}
                    width={width}
                    height={height} />
            </svg>
        );
    };


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
                    <pattern id="pattern-stripe"
                        width="8" height="8"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)">
                        <rect width="5" height="8" transform="translate(0,0)" fill="white"></rect>
                    </pattern>
                    <mask id="mask-stripe">
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-stripe)" />
                    </mask>
                    <Bar dataKey="pupils"
                        stackId="a" 
                        name={props.isPrediction ? "Predikerte elever" : "Elever"}
                        fill="#5874fc"
                        barSize={30}
                        // @ts-ignore
                        shape={props.isPrediction ? <PredictionBar /> : null}
                    />
                    <Bar dataKey="spesped" 
                    stackId="a" 
                    name={props.isPrediction ? "Predikerte spesped" : "Spesped"}
                    fill="#54c4fc"
                    // @ts-ignore
                    shape={props.isPrediction ? <PredictionBar /> : null}
                    />
                </BarChart>

            </ResponsiveContainer>
        </div>
    )
}


