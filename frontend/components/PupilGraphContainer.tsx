import React from 'react'
import { SemesterSelectorData } from '../Interfaces'
import ContainerStyle from '../styles/GraphContainer.module.css'
import PupilSemsterGraph from './PupilSemesterGraph'
import PupilSidePanel from './PupilSidePanel'
import SemesterSelector from './SemesterSelector'

export default function PupilGraphContainer(props: { data: any, currentSemester: string, semesterSelector: any, semesterSelectorData: SemesterSelectorData, maxAmount: number, allPupilDataMap: any }) {

    return (
        <div className={ContainerStyle.container}>
            <div className={ContainerStyle.graph}>
                <div className={ContainerStyle.graphYear}>
                    <SemesterSelector semesterSelector={props.semesterSelector} semesterSelectorData={props.semesterSelectorData} />
                </div>
                <PupilSemsterGraph data={props.data} maxAmount={props.maxAmount} />
            </div>
            <div className={ContainerStyle.info}>
                <PupilSidePanel allPupilDataMap={props.allPupilDataMap} currentSemester={props.currentSemester} semesterSelectorData={props.semesterSelectorData} />
            </div>
        </div>
    )
}