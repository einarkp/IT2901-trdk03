import React, { useEffect, useState } from 'react'
import { IconContext } from 'react-icons';
import { BsArrowRightCircle, BsArrowLeftCircle } from 'react-icons/bs';
import { SemesterSelectorData } from '../Interfaces';
import YearSelectorStyle from '../styles/YearSelector.module.css'

export default function SemesterSelector(props: { semesterSelector: any, semesterSelectorData: SemesterSelectorData }) {
    const [currentSemester, setCurrentSemester] = useState(props.semesterSelectorData.currentSemester)
    const [displayedSemester, setDisplayedSemester] = useState(getSemesterDisplayName(props.semesterSelectorData.currentSemester))
    const [rightArrowDisabled, setRightArrowDisabled] = useState(false)
    const [leftArrowDisabled, setLeftArrowDisabled] = useState(false)

    function getSemesterDisplayName(dateString: string) { 
        const date = new Date(dateString)
        if (date.getMonth() == 7) return "HØST " + date.getFullYear()
        else return "VÅR " + date.getFullYear()
    }

    useEffect(() => {
        let lastSemesterValue = props.semesterSelectorData.allSemesters[props.semesterSelectorData.allSemesters.length - 1]
        let firstYearValue = props.semesterSelectorData.allSemesters[0]
        if (lastSemesterValue == currentSemester) setRightArrowDisabled(true)
        if (firstYearValue == currentSemester)  setLeftArrowDisabled(true)

    }, [currentSemester])

    function handleIncrement() {
        let lastSemesterValue = props.semesterSelectorData.allSemesters[props.semesterSelectorData.allSemesters.length - 1]
        if (currentSemester != lastSemesterValue) {
            let nextSemester = props.semesterSelectorData.allSemesters[props.semesterSelectorData.allSemesters.indexOf(currentSemester) + 1]
            props.semesterSelector(nextSemester)
            setCurrentSemester(nextSemester)
            const displayedSemesterValue = getSemesterDisplayName(nextSemester)
            setDisplayedSemester(displayedSemesterValue) 
        }
        setLeftArrowDisabled(false)
    }
    function handleDecrement() {
        if (currentSemester != props.semesterSelectorData.allSemesters[0]) {
          let lastSemester= props.semesterSelectorData.allSemesters[props.semesterSelectorData.allSemesters.indexOf(currentSemester) - 1]
          props.semesterSelector(lastSemester)
          setCurrentSemester(lastSemester)
          const displayedSemesterValue = getSemesterDisplayName(lastSemester)
          setDisplayedSemester(displayedSemesterValue) 
        }
        setRightArrowDisabled(false)
    }

    const RightArrow = () => {
        return (
            <IconContext.Provider
                value={{ color: rightArrowDisabled ? 'grey' : "black", size: '40px' }}
            >
                <div>
                    <BsArrowRightCircle onClick={handleIncrement}
                        style={{ cursor: rightArrowDisabled ? "" : "pointer" }}
                    />
                </div>
            </IconContext.Provider>
        );
    }

    const LeftArrow = () => {
        return (
            <IconContext.Provider
                value={{ color: leftArrowDisabled ? 'grey' : "black", size: '40px' }}
            >
                <div>
                    <BsArrowLeftCircle onClick={handleDecrement}
                        style={{ cursor: leftArrowDisabled ? "" : "pointer" }} />
                </div>
            </IconContext.Provider>
        );
    }

    return (
        <div className={YearSelectorStyle.yearSelector} >
            <LeftArrow />
            <div className={YearSelectorStyle.displayedYear}>{displayedSemester}</div>
            <RightArrow />
        </div>
    )
}