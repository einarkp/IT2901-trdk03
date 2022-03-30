import { useEffect, useState } from "react";
import { SemesterSelectorData } from "../Interfaces";
import styles from '../styles/PupilSidePanel.module.css'
import { splitAmountFormatter } from "../utils/Formatters";

export default function PupilSidePanel(props: { allPupilDataMap: any, currentSemester: string, semesterSelectorData: SemesterSelectorData }) {
    const [budgetChange, setBudgetChange] = useState(Number.POSITIVE_INFINITY)
    const [budgetChangePercent, setBudgetChangePercent] = useState(0)
    const [currentBudget, setCurrentBudget] = useState("")
    const [previousYear, setPreviousYear] = useState(0)
    const [currentPupils, setCurrentPupils] = useState(0)
    const [pupilChange, setPupilChange] = useState(Number.POSITIVE_INFINITY)
    const [pupilChangePercent, setPupilChangePercent] = useState(0)
    const [currentSpesped, setCurrentSpesped] = useState(0)
    const [spespedChange, setSpespedChange] = useState(Number.POSITIVE_INFINITY)
    const [spespedChangePercent, setSpespedChangePercent] = useState(0)
    const [isPrediction, setIsPrediction] = useState(false)

    function calculateChange() {
        // calculate budget change:
        const currentBudget = props.allPupilDataMap.get(props.currentSemester)[0].budget
        if (currentBudget !== null) {
            setCurrentBudget(String(splitAmountFormatter(currentBudget)) + "kr")
            const currentYear = new Date(props.currentSemester).getFullYear()
            let allYears: number[] = []
            props.semesterSelectorData.allSemesters.forEach(date => {
                const year = new Date(date).getFullYear()
                if (!allYears.includes(year)) allYears.push(year)
            });
            allYears = allYears.sort()
            if (allYears.indexOf(currentYear) != 0) {
                const previousYear = allYears[allYears.indexOf(currentYear) - 1]
                setPreviousYear(previousYear)
                const previousYearObject = props.semesterSelectorData.allSemesters.find((semester) => new Date(semester).getFullYear() == previousYear)
                const previousBudget = props.allPupilDataMap.get(previousYearObject)[0].budget
                const change = currentBudget - previousBudget
                const percentchange = Math.abs((currentBudget - previousBudget) / previousBudget * 100.0)
                setBudgetChangePercent(Number(percentchange.toFixed(1)))
                setBudgetChange(change)
            }
            else if (allYears.indexOf(currentYear) == 0) {
                setBudgetChange(Number.POSITIVE_INFINITY)
                setPreviousYear(0)
            }
        }
        else {
            setBudgetChange(Number.POSITIVE_INFINITY)
            setCurrentBudget("Ingen data")
            setPreviousYear(0)
        }

        // Calculate pupil and spesped change
        let currentPupilCount = 0
        let currentSpespedCount = 0
        props.allPupilDataMap.get(props.currentSemester).forEach((pupilObject: { pupils: number | null, spesped: number | null; }) => {
            if (pupilObject.pupils != null) currentPupilCount += pupilObject.pupils
            if (pupilObject.spesped != null) currentSpespedCount += pupilObject.spesped
        });
        setCurrentPupils(currentPupilCount)
        setCurrentSpesped(currentSpespedCount)
        const currentSemesterIndex = props.semesterSelectorData.allSemesters.indexOf(props.currentSemester)
        if (currentSemesterIndex != 0) {
            const lastSemesterData = props.allPupilDataMap.get(props.semesterSelectorData.allSemesters[currentSemesterIndex - 1])
            let lastSemesterPupilCount = 0
            let lastSemesterSpespedCount = 0
            lastSemesterData.forEach((pupilObject: { pupils: number | null, spesped: number | null; }) => {
                if (pupilObject.pupils != null) lastSemesterPupilCount += pupilObject.pupils
                if (pupilObject.spesped != null) lastSemesterSpespedCount += pupilObject.spesped
            });
            const pupilChange = currentPupilCount - lastSemesterPupilCount
            const percentchange = Math.abs((currentPupilCount - lastSemesterPupilCount) / lastSemesterPupilCount * 100.0);
            setPupilChangePercent(Number(percentchange.toFixed(1)))
            setPupilChange(pupilChange)

            const spedspedChange = currentSpespedCount - lastSemesterSpespedCount
            const spesPerChange = Math.abs((currentSpespedCount - lastSemesterSpespedCount) / lastSemesterSpespedCount * 100.0);
            setSpespedChangePercent(Number(spesPerChange.toFixed(1)))
            setSpespedChange(spedspedChange)
        } else {
            // No data, no change
            setPupilChange(Number.POSITIVE_INFINITY)
            setSpespedChange(Number.POSITIVE_INFINITY)
        }
    }

    useEffect(() => {
        // If we are in the displayed semester or the displayed semester is in the future, allow changing pupil amount
        const now = new Date()
        const nowMonth = now.getMonth() + 1
        const currentSemesterDate = new Date(props.currentSemester)
        if (now.getFullYear() < currentSemesterDate.getFullYear()
            || (now.getFullYear() == currentSemesterDate.getFullYear() && nowMonth < 8)) setIsPrediction(true)
        else setIsPrediction(false)
        calculateChange()
    }, [props.currentSemester])


    return <>
        <div className={styles.container}>
            {isPrediction ? <span className={styles.topText}>Predikert Budsjett</span> : <span className={styles.topText}>Budjsett og endringer</span>}
            <table className={styles.infoTable}>
                <tbody>
                    <tr>
                        <td>Årsbudsjett</td>
                        <td>{currentBudget}</td>
                    </tr>
                    <tr>
                        <td>Endring {previousYear != 0 ? " (" + previousYear + ")" : null}</td>
                        {budgetChange > 0 && budgetChange < Number.POSITIVE_INFINITY ? <td style={{ color: "#2F8A04" }}>{"+" + splitAmountFormatter(budgetChange) + "kr (" + budgetChangePercent + "%)"}</td> : null}
                        {budgetChange < 0 ? <td style={{ color: "red" }}>{splitAmountFormatter(budgetChange) + "kr (" + budgetChangePercent + "%)"}</td> : null}
                        {budgetChange === 0 ? <td>{budgetChange}</td> : null}
                        {budgetChange === Number.POSITIVE_INFINITY ? <td>{"Ingen data"}</td> : null}
                    </tr>
                    <tr><td>⠀</td></tr>  {/* <-- Cursed invisible character,  TODO:  find a better way to space table  */}
                    <tr>
                        <td>Antall elever</td>
                        <td>{currentPupils}</td>
                    </tr>
                    <tr>
                        <td>Endring</td>
                        {pupilChange > 0 && pupilChange < Number.POSITIVE_INFINITY ? <td style={{ color: "#2F8A04" }}>{"+" + pupilChange + " (" + pupilChangePercent + "%)"}</td> : null}
                        {pupilChange < 0 ? <td style={{ color: "red" }}>{pupilChange + " (" + pupilChangePercent + "%)"}</td> : null}
                        {pupilChange === 0 ? <td>{pupilChange}</td> : null}
                        {pupilChange === Number.POSITIVE_INFINITY ? <td>{"Ingen data"}</td> : null}
                    </tr>
                    <tr><td>⠀</td></tr> {/* <-- Cursed invisible character, TODO: find a better way to space table  */}
                    <tr>
                        <td>Spesped</td>
                        <td>{currentSpesped}</td>
                    </tr>
                    <tr>
                        <td>Endring</td>
                        {spespedChange > 0 && spespedChange < Number.POSITIVE_INFINITY ? <td style={{ color: "#2F8A04" }}>{"+" + spespedChange + " (" + spespedChangePercent + "%)"}</td> : null}
                        {spespedChange < 0 ? <td style={{ color: "red" }}>{spespedChange + " (" + spespedChangePercent + "%)"}</td> : null}
                        {spespedChange === 0 ? <td>{spespedChange}</td> : null}
                        {spespedChange === Number.POSITIVE_INFINITY ? <td>{"Ingen data"}</td> : null}
                    </tr>

                </tbody>
            </table>
        </div>
    </>
}