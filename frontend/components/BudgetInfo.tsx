import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import React, { Fragment, useEffect, useState } from 'react'
import styles from '../styles/BudgetInfo.module.css'
import { longMonthFormatter, splitAmountFormatter, percentChange, singleDecimalFormatter } from '../utils/Formatters'
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { BsQuestionCircle } from 'react-icons/bs';


export const BudgetInfo = ({ data, info, oldData, currentMonth, schoolName }: any) => {
  const displayedYear = new Date(data[0].date).getFullYear()
  const currentYear = new Date().getFullYear()
  const isHistoricalView = displayedYear < currentYear

  let percentage = 100
  if (info.resultPercent < 100) {
    percentage = 100 - info.resultPercent
  } else {
    percentage = info.resultPercent - 100
  }
  const ResultsPositive = () => (
    <div className={styles.resultPositive}>
      <span className={styles.resultText}>Ja</span> <br />
      <span> {isHistoricalView ? `Forbruket endte ${percentage}% under budsjettet` : `Forbruket er projektert ${percentage}% under budsjettet`}</span>
    </div>
  )
  const ResultsNegative = () => (
    <div className={styles.resultNegative}>
      <span className={styles.resultText}>Nei</span> <br />
      <span> {isHistoricalView ? `Forbruket endte ${percentage}% over budsjettet` : `Forbruket bør nedjusteres ${percentage}%`}</span>
    </div>
  )
  const ResultsBetween = () => (
    <div className={styles.resultBetween}>
      <span className={styles.resultText}>Tja..</span> <br />
      <span>Forbruket er projektert {percentage}% under budsjettet</span>
    </div>
  )

  // Element displaying up ur down arrow with percentage e.g. (up arrow) 17%
  const PercentageElement = (props: { percent: number, moreIsBetter: boolean }) => {
    if (props.percent == -100 || props.percent == 100) {
      return <span />
    } else if (props.percent >= 5) {
      if (props.moreIsBetter) {
        return <span className={styles.percentagePositive}> <CaretUpOutlined style={{ color: 'green' }} />{singleDecimalFormatter(props.percent)}%</span>
      } else {
        return <span className={styles.percentageNegative}> <CaretUpOutlined style={{ color: 'red' }} />{singleDecimalFormatter(props.percent)}%</span>
      }
    } else if (-5 > props.percent) {
      if (props.moreIsBetter) {
        return <span className={styles.percentageNegative}> <CaretDownOutlined style={{ color: 'red' }} />{singleDecimalFormatter(props.percent)}%</span>
      } else {
        return <span className={styles.percentagePositive}> <CaretDownOutlined style={{ color: 'green' }} />{singleDecimalFormatter(props.percent)}%</span>
      }
    } else {
      return <span className={styles.percentageMedium}> <CaretDownOutlined style={{ color: "rgb(217, 190, 0)" }} />{singleDecimalFormatter(props.percent)}%</span>
    }
  }


  // toggles between normal view and detail view, as well as accountings and predictions
  let prediction = false
  let normalView = false

  if (currentMonth == null) {
    normalView = true
  }

  if (!normalView && data[currentMonth].accounting == null) {
    prediction = true
  }

  const [previousAccounting, setPreviousAccounting] = useState("...")
  const [previousCumulativeAccounting, setPreviousCumulativeAccounting] = useState("...")
  const [previousBudget, setPreviousBudget] = useState("...")

  const [accountingPercent, setAccountingPercent] = useState(Number)
  const [cumulativeAccountingPercent, setCumulativeAccountingPercent] = useState(Number)
  const [budgetPercent, setBudgetPercent] = useState(Number)
  // const [displayMonth, setDisplayMonth] = useState("...")
  const [previousDisplayMonth, setPreviousDisplayMonth] = useState("...")

  const [isPrediction, setIsPrediction] = useState(false)

  // const [schoolName, setSchoolName] = useState("")

  // Updates data when month changes
  // Currently, if a month is selected only the top part of the side panels values are updated if you change the year.
  // This allows "locking-in" a previous value you might want to compare, but could also just automatically update both parts when changing year.
  useEffect(() => {
    if (currentMonth != null) {
      const year = data[currentMonth].date.getFullYear()
      const date = new Date(year, currentMonth, 1)
      const prevDate = new Date(year - 1, currentMonth, 1)
      // setDisplayMonth(longMonthFormatter(date)) 
      setPreviousDisplayMonth(longMonthFormatter(prevDate))
      if (oldData.length != 0) {
        setPreviousAccounting(String(splitAmountFormatter(oldData[currentMonth].accounting)))
        setPreviousCumulativeAccounting(String(splitAmountFormatter(oldData[currentMonth].cumulativeAccounting)))
        setPreviousBudget(String(splitAmountFormatter(oldData[currentMonth].budget)))

        //Percentages
        //Calculated with formula ((NewValue - PrevValue)/PrevValue)*100
        let budPercent = percentChange(oldData[currentMonth].budget, data[currentMonth].budget)
        setBudgetPercent(budPercent)
        if (prediction) {
          let accPercent = percentChange(oldData[currentMonth].accounting, data[currentMonth].accountingPrediction)
          setAccountingPercent(accPercent)
          let cumAccPercent = percentChange(oldData[currentMonth].cumulativeAccounting, data[currentMonth].cumulativeAccountingPrediction)
          setCumulativeAccountingPercent(cumAccPercent)
        } else {
          let accPercent = percentChange(oldData[currentMonth].accounting, data[currentMonth].accounting)
          setAccountingPercent(accPercent)
          let cumAccPercent = percentChange(oldData[currentMonth].cumulativeAccounting, data[currentMonth].cumulativeAccounting)
          setCumulativeAccountingPercent(cumAccPercent)
        }
      }
    }
  }, [currentMonth])

  const DetailedTable = () => (
    <div>
      <table className={styles.infoTable}>
        <tbody>
          <tr className={styles.displayedMonth}>{longMonthFormatter(new Date(data[currentMonth].date.getFullYear(), currentMonth, 1))}</tr>
          <tr>
            <td>{prediction ? <span>Regnskap (prognose)</span> : <span>Regnskap</span>}</td>
            <td>{prediction
              ? splitAmountFormatter(data[currentMonth].accountingPrediction)
              : splitAmountFormatter(data[currentMonth].accounting)
            }</td>
            <td>{prediction
              ? <PercentageElement percent={accountingPercent} moreIsBetter={false} />
              : <PercentageElement percent={accountingPercent} moreIsBetter={false} />
            }</td>
          </tr>
          <tr>
            <td>{prediction ? <span>Totalregnskap (prognose)</span> : <span>Totalregnskap</span>}</td>
            <td>{prediction
              ? splitAmountFormatter(data[currentMonth].cumulativeAccountingPrediction)
              : splitAmountFormatter(data[currentMonth].cumulativeAccounting)
            }</td>
            <td>{prediction
              ? <PercentageElement percent={cumulativeAccountingPercent} moreIsBetter={false} />
              : <PercentageElement percent={cumulativeAccountingPercent} moreIsBetter={false} />
            }</td>
          </tr>
          <tr>
            <td>Budsjett {"(" + new Date(data[currentMonth].date).getFullYear() + ")"}</td>
            <td>
              {splitAmountFormatter(data[currentMonth].budget)}
            </td>
            <td>
              <PercentageElement percent={budgetPercent} moreIsBetter={true} />
            </td>
          </tr>
        </tbody>
      </table>

      <table className={styles.infoTable}>
        <tbody>
          <tr className={styles.displayedMonth}>
            {previousDisplayMonth}
          </tr>
          <tr>
            <td>Regnskap</td>
            <td>{previousAccounting}</td>
            <td></td>
          </tr>
          <tr>
            <td>Totalregnskap</td>
            <td>{previousCumulativeAccounting}</td>
            <td></td>
          </tr>
          <tr>
            <td>Budsjett {"(" + new Date(oldData[currentMonth].date).getFullYear() + ")"}</td>
            <td>{previousBudget}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )

  const InfoTable = () => (
    <table className={styles.infoTable}>
      <tbody>
        <tr>
          <td>Beste måned:</td>
          <td>{splitAmountFormatter(Number(info.bestMonth.split(" ")[0])) + " kr " + info.bestMonth.split(" ")[1]}</td>
        </tr>
        <tr>
          <td>Verste måned:</td>
          <td>{splitAmountFormatter(Number(info.worstMonth.split(" ")[0])) + " kr " + info.worstMonth.split(" ")[1]}</td>
        </tr>
      </tbody>
    </table>
  )

  const HtmlTooltip = styled(({ className, ...props }) => (
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
    <div className={styles.container}>
      <span style={{fontSize: "2em", textDecoration: ""}}>
       {schoolName}
      </span>
      <span className={styles.topText} style={{ display: "flex", alignItems: "center" }}> {isHistoricalView ? "Gikk budsjettet rundt?" : "Vil budsjettet gå rundt?"}<HtmlTooltip
        title={
          <Fragment>
            <Typography color="inherit">{
            isHistoricalView ? 
            "Denne siden viser historiske regnskapsverdier. Trykk på ett punkt på grafen for å se mer detaljer for en spesifikk måned." : 
            "Denne siden viser predikerte regnskapsverdier. Under ser du det predikerte sluttresultatet."}
            </Typography>
          </Fragment>
        }
      >
        <IconButton><BsQuestionCircle /></IconButton>
      </HtmlTooltip></span>
      
      {info.result ? (info.withinMargin ? <ResultsBetween /> : <ResultsPositive />) : <ResultsNegative />}

      {normalView ? <InfoTable /> : <DetailedTable />}
    </div>
  )
}
