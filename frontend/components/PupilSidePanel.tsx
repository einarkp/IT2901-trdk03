import { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from "react";
import { SemesterSelectorData } from "../Interfaces";
import styles from '../styles/PupilSidePanel.module.css'
import { UpdateDatabase } from "../utils/APIUtils";
import { splitAmountFormatter } from "../utils/Formatters";
import { BsQuestionCircle } from "react-icons/bs"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { StoreContext } from '../pages/_app';

export default function PupilSidePanel(props: { allPupilDataMap: any, currentSemester: string, semesterSelectorData: SemesterSelectorData, refreshData: any, schoolName: string }) {
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
    const [showPupilForm, setShowPupilForm] = useState(false)
    const [pupilChangeArr, setPupilChangeArr] = useState(new Array(props.allPupilDataMap.get(props.currentSemester).length).fill(0))
    const [spespedChangeArr, setSpespedChangeArr] = useState(new Array(props.allPupilDataMap.get(props.currentSemester).length).fill(0))
    const [inputFields, setInputFields] = useState(Array.from(Array(props.allPupilDataMap.get(props.currentSemester).length), () => ({ pupil: '', spesped: '' })))
    const [predictedBudget, setPredictedBudget] = useState(0)
    const [predictedPercentChange, setPredictedPercentChange] = useState(0)
    const [rerender, setRerender] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [showUnsavedDataMessage, setShowUnsavedDataMessage] = useState(false)
    const [showFirstTimePredictionMessage, setShowFirstTimePredictionMessage] = useState(false)
    const prevAllPupilDataMap = usePrevious(props.allPupilDataMap)
    const valueOfPupil = 80000
    const valueOfSpesped = 100000
    const store = useContext(StoreContext)

    function usePrevious(value: any) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    useEffect(() => {
        // If we are in the displayed autumn semester or the displayed autumn semester is in the future, allow changing pupil amount
        const now = new Date()
        const currentSemesterDate = new Date(props.currentSemester)
        if (currentSemesterDate.getMonth() != 7) setIsPrediction(false)
        else if (now.getFullYear() <= currentSemesterDate.getFullYear()) setIsPrediction(true)

        // If the values are prediction values tell the user to verify the values
        const firstTimePrediction = props.allPupilDataMap.get(props.currentSemester)[0].isPrediction
        if (firstTimePrediction) setShowFirstTimePredictionMessage(true)
        else setShowFirstTimePredictionMessage(false)
        if (isPrediction) {
            setPredictedBudget(props.allPupilDataMap.get(props.currentSemester)[0].predictedBudget)
            const currentBudget = props.allPupilDataMap.get(props.currentSemester)[0].budget
            const percentchange = (props.allPupilDataMap.get(props.currentSemester)[0].predictedBudget - currentBudget) / currentBudget * 100.0
            setPredictedPercentChange(Number(percentchange.toFixed(1)))
        }
        calculateChange()
        // After updating pupil amount and getting new data, continue showing the form.
        // @ts-ignore
        if (props.allPupilDataMap.get(props.currentSemester) != prevAllPupilDataMap?.get(props.currentSemester) && prevAllPupilDataMap?.get(props.currentSemester)) {
            setShowPupilForm(true)
        }
        else setShowPupilForm(false)

    }, [props.currentSemester, props.allPupilDataMap])

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

    function resetPupilForm() {
        setInputFields(Array.from(Array(props.allPupilDataMap.get(props.currentSemester).length), () => ({ pupil: '', spesped: '' })))
        setPupilChangeArr(new Array(props.allPupilDataMap.get(props.currentSemester).length).fill(0))
        setSpespedChangeArr(new Array(props.allPupilDataMap.get(props.currentSemester).length).fill(0))
        setPredictedBudget(props.allPupilDataMap.get(props.currentSemester)[0].predictedBudget)
        const currentBudget = props.allPupilDataMap.get(props.currentSemester)[0].budget
        const percentchange = (props.allPupilDataMap.get(props.currentSemester)[0].predictedBudget - currentBudget) / currentBudget * 100.0
        setPredictedPercentChange(Number(percentchange.toFixed(1)))
        setShowUnsavedDataMessage(false)
    }


    const InfoPanel = () => (
        <div className={styles.container}>
            <span style={{fontSize: "2em"}}>
       {props.schoolName}
      </span>
            {isPrediction ? showFirstTimePredictionMessage ? <span className={styles.topText}>Predikert budsjett</span> : <span className={styles.topText}>Estimert budsjett</span> : <span className={styles.topText}>Budsjett og endringer</span>}
            <table className={styles.infoTable}>
                <tbody>
                    <tr>
                        <td>Årsbudsjett</td>
                        <td>{currentBudget}</td>
                    </tr>
                    <tr>
                        <td>Endring {previousYear != 0 ? " (" + previousYear + ")" : null}</td>
                        {budgetChange > 0 && budgetChange < Number.POSITIVE_INFINITY ? <td style={{ color: "#3A933E" }}>{"+" + splitAmountFormatter(budgetChange) + "kr (" + budgetChangePercent + "%)"}</td> : null}
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
                        {pupilChange > 0 && pupilChange < Number.POSITIVE_INFINITY ? <td style={{ color: "#3A933E" }}>{"+" + pupilChange + " (" + pupilChangePercent + "%)"}</td> : null}
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
                        {spespedChange > 0 && spespedChange < Number.POSITIVE_INFINITY ? <td style={{ color: "#3A933E" }}>{"+" + spespedChange + " (" + spespedChangePercent + "%)"}</td> : null}
                        {spespedChange < 0 ? <td style={{ color: "red" }}>{spespedChange + " (" + spespedChangePercent + "%)"}</td> : null}
                        {spespedChange === 0 ? <td>{spespedChange}</td> : null}
                        {spespedChange === Number.POSITIVE_INFINITY ? <td>{"Ingen data"}</td> : null}
                    </tr>
                </tbody>
            </table>
            <div className={styles.changePupilsButton}>
                {isPrediction ? <button onClick={() => { setShowPupilForm(true); resetPupilForm() }} className={styles.button}>{showFirstTimePredictionMessage ? "Verifiser elevantall" : "Endre elevantall"}</button> : null}
            </div>
        </div>
    )

    function computePredictedBudget() {
        if (currentBudget == "" || currentBudget == "Ingen data") return

        // Get all old values, then replace with new values if exists, compute difference, compute new budget
        const oldPupilSum = props.allPupilDataMap.get(props.currentSemester).map((i: { pupils: number; }) => i.pupils).reduce((a: number, b: number) => a + b);
        const oldSpespedSum = props.allPupilDataMap.get(props.currentSemester).map((i: { spesped: number; }) => i.spesped).reduce((a: number, b: number) => a + b);
        let newPupilSum = 0
        let newSpespedSum = 0
        inputFields.forEach((inputObject, index) => {
            if (inputObject.pupil == "") newPupilSum += props.allPupilDataMap.get(props.currentSemester)[index].pupils
            else newPupilSum += Number(inputObject.pupil)
            if (inputObject.spesped == "") newSpespedSum += props.allPupilDataMap.get(props.currentSemester)[index].spesped
            else newSpespedSum += Number(inputObject.spesped)
        })

        const budgetPupilChange = (newPupilSum - oldPupilSum) * valueOfPupil
        const budgetSpespedChange = (newSpespedSum - oldSpespedSum) * valueOfSpesped
        const totalChange = budgetPupilChange + budgetSpespedChange
        const previousBudget = Number(currentBudget.replace("kr", "").replace(/\s/g, ""))
        const newBudgetValue = props.allPupilDataMap.get(props.currentSemester)[0].predictedBudget + totalChange
        const percentchange = (newBudgetValue - previousBudget) / previousBudget * 100.0

        setPredictedPercentChange(Number(percentchange.toFixed(1)))
        setPredictedBudget(newBudgetValue)

    }

    function handleClickAwayPupil(value: string, index: number) {
        if (value === "") return
        if (!showUnsavedDataMessage) setShowUnsavedDataMessage(true)
        let oldValue = props.allPupilDataMap.get(props.currentSemester)[index].pupils
        let tempChangeArrCopy = pupilChangeArr
        tempChangeArrCopy[index] = Number(Number(value) - oldValue)
        computePredictedBudget()
        setPupilChangeArr(tempChangeArrCopy)
        setRerender(!rerender)
    }

    function handleClickAwaySpesped(value: string, index: number) {
        if (value === "") return
        if (!showUnsavedDataMessage) setShowUnsavedDataMessage(true)
        let oldValue = props.allPupilDataMap.get(props.currentSemester)[index].spesped
        let tempChangeArrCopy = spespedChangeArr
        tempChangeArrCopy[index] = Number(Number(value) - oldValue)
        computePredictedBudget()
        setSpespedChangeArr(tempChangeArrCopy)
        setRerender(!rerender)
    }

    function handlePupilChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        let data = [...inputFields];
        const value = Math.abs(Math.floor(Number(event.target.value)));
        data[index].pupil = String(value);
        setInputFields(data);
    }

    function handleSpespedChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        let data = [...inputFields];
        const value = Math.abs(Math.floor(Number(event.target.value)));
        data[index].spesped = String(value);
        setInputFields(data);
    }

    async function saveForm() {  // TODO: add support for spesped when this exists in backend.
        // Updates pupil values in db, pad list with 0's for grades that do not exist.
        setSuccessMessage("")
        setErrorMessage("")
        let containsZero = inputFields.find(inputField => inputField.pupil === "0"); // There needs to be pupils in every class.
        if (containsZero) {
            setErrorMessage("Elevantall kan ikke være 0")
            setTimeout(() => { setErrorMessage("") }, 5000);
            return
        }
        const oldAutmnValues = props.allPupilDataMap.get(props.currentSemester)  // (also prediction values)
        if (store.activeUser?.schoolID === undefined || (oldAutmnValues[0].school != store.activeUser?.schoolID) && store.activeUser?.user_type != "admin") {
            setErrorMessage("Du kan kun laste opp data for din egen skole")
            setTimeout(() => { setErrorMessage("") }, 5000);
            return
        }
        const springDate = new Date("01-01-" + new Date(props.currentSemester).getFullYear()).toDateString()
        const oldSpringValues = props.allPupilDataMap.get(springDate)
        const object2send = {
            schoolId: oldAutmnValues[0].school,
            year: new Date(props.currentSemester).getFullYear(),
            autumn: new Array(10).fill(0),
            spring: new Array(10).fill(0)
        }
        oldAutmnValues.forEach((autumnObject: { grade: number }, index: number) => {
            let currentIndex = autumnObject.grade - 1
            if (inputFields[index].pupil === "") object2send.autumn[currentIndex] = oldAutmnValues[index].pupils
            else object2send.autumn[currentIndex] = Number(inputFields[index].pupil)
            object2send.spring[currentIndex] = oldSpringValues[index].pupils
        })

        await UpdateDatabase("pupils", [object2send]).then((response) => {
            if (response == "Probably added some Pupil values") {
                const newBudgetPredictionObject = {
                    schoolId: oldAutmnValues[0].school,
                    year: new Date(props.currentSemester).getFullYear(),
                    month: 1,
                    amount: predictedBudget
                }
                UpdateDatabase("budgetpredictions", [newBudgetPredictionObject]).then((response) => {
                    if (response == "Probably added some budget predictions") {
                        resetPupilForm()
                        setShowUnsavedDataMessage(false)
                        setSuccessMessage("Elevantallet og det estimerte budsjettet ble oppdatert!")
                        setTimeout(() => { setSuccessMessage("") }, 5000);
                        props.refreshData()
                    } else {
                        setErrorMessage("Noe gikk galt")
                        setTimeout(() => { setErrorMessage("") }, 5000);
                    }
                })

            } else {
                setErrorMessage("Noe gikk galt")
                setTimeout(() => { setErrorMessage("") }, 5000);
            }
        }).catch((error) => {
            console.error(error)
            setErrorMessage("Noe gikk galt")
            setTimeout(() => { setErrorMessage("") }, 5000);
        })
    }
    // @ts-ignore: this tooltip component is not very TypeScript friendly
    const HtmlTooltip = styled(({ className, ...props }) => (
            // @ts-ignore: this tooltip component is not very TypeScript friendly
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#f5f5f9",
            color: "rgba(0, 0, 0, 0.87)",
            maxWidth: 400,
            fontSize: theme.typography.pxToRem(12),
            border: "1px solid #dadde9"
        }
    }));

    return (
        <div>
            {showPupilForm ? <div className={styles.container}>
                {showFirstTimePredictionMessage ? <span className={styles.topText} style={{ display: "flex", alignItems: "center" }}>Verifiser predikert elevantall  <div style={{ width: "20px" }}>
                    <HtmlTooltip
                        // @ts-ignore: this tooltip component is not very TypeScript friendly
                        title={
                            <Fragment>
                                <Typography color="inherit">Elevtallene på denne siden er prediksjoner. Verifiser tallene og trykk lagre for å se estimert budsjett.</Typography>
                            </Fragment>
                        }
                    >
                        <IconButton><BsQuestionCircle /></IconButton>
                    </HtmlTooltip>
                </div> </span> :
                    <span className={styles.topText}>Endre elevantall</span>}

                <table >
                    <tbody>
                        <tr>
                            <td></td>
                            <td>Total</td>
                            <td>Spesped</td>
                        </tr>
                        {inputFields.map((input, index) => {
                            return (
                                <tr key={index}>
                                    <td >{props.allPupilDataMap.get(props.currentSemester)[index].gradeLabel + ":"}</td>
                                    <td>
                                        <input className={styles.inputField} value={input.pupil} type="number" min="1" step="1"
                                            placeholder={props.allPupilDataMap.get(props.currentSemester)[index].pupils ? props.allPupilDataMap.get(props.currentSemester)[index].pupils : "0"}
                                            onBlur={(e: React.FormEvent<HTMLInputElement>) => { handleClickAwayPupil(e.currentTarget.value, index) }}
                                            onChange={event => handlePupilChange(index, event)}
                                        />
                                        <span style={{ marginLeft: "10px" }}>
                                            {pupilChangeArr[index] > 0 ? <span style={{ color: "#3A933E" }}>{"+" + pupilChangeArr[index]}</span> : null}
                                            {pupilChangeArr[index] < 0 ? <span style={{ color: "red" }}>{pupilChangeArr[index]}</span> : null}
                                            {pupilChangeArr[index] == 0 ? <span style={{ color: "#a6a6a6" }} >{"+" + pupilChangeArr[index]}</span> : null}
                                        </span>
                                    </td>
                                    <td>
                                        <input value={input.spesped} type="number" min="0" className={styles.inputField} step="1"
                                            placeholder={props.allPupilDataMap.get(props.currentSemester)[index].spesped ? props.allPupilDataMap.get(props.currentSemester)[index].spesped : "0"}
                                            onBlur={(e: React.FormEvent<HTMLInputElement>) => { handleClickAwaySpesped(e.currentTarget.value, index) }}
                                            onChange={event => handleSpespedChange(index, event)}
                                        />
                                        <span style={{ marginLeft: "10px" }}>
                                            {spespedChangeArr[index] > 0 ? <span style={{ color: "#3A933E" }}>{"+" + spespedChangeArr[index]}</span> : null}
                                            {spespedChangeArr[index] < 0 ? <span style={{ color: "red" }}>{spespedChangeArr[index]}</span> : null}
                                            {spespedChangeArr[index] == 0 ? <span style={{ color: "#a6a6a6" }} >{"+" + spespedChangeArr[index]}</span> : null}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <table style={{ borderCollapse: "separate", borderSpacing: '0px 15px', marginTop: "20px" }}>
                    <tbody>
                        <tr>
                            <td>Nåværende budsjett:</td>
                            <td>{currentBudget}</td>
                        </tr>
                        <tr>
                            {showFirstTimePredictionMessage ? <td>Predikert budsjett:</td> : <td>Estimert budsjett:</td>}
                            <td>{predictedBudget != 0 ? String(splitAmountFormatter(predictedBudget)) + "kr" : null}</td>
                        </tr>
                        {predictedBudget != 0 ?
                            <tr>
                                <td>Endring: </td>
                                <td><span className="budgetChangeAmount" style={{ color: predictedPercentChange < 0 ? "red" : "#3A933E" }}>{" " + splitAmountFormatter(predictedBudget - Number(currentBudget.replace("kr", "").replace(/\s/g, ""))) + "kr"} {"(" + predictedPercentChange + "%)"} </span></td>
                            </tr>
                            : null}
                    </tbody>
                </table>
                <div className={styles.buttonContainer}>
                    <button onClick={() => setShowPupilForm(false)} className={styles.button}>Avbryt</button>
                    <button className={styles.button} onClick={() => saveForm()} >Lagre</button>
                </div>
                {successMessage != "" ? <span style={{ color: "#3A933E" }} >{successMessage}</span> : null}
                {errorMessage != "" ? <span style={{ color: "red" }}>{errorMessage}</span> : null}
                {showUnsavedDataMessage ? <span >{"(Du har ulagret data)"}</span> : null}

            </div> : <InfoPanel />}
        </div>
    )
}