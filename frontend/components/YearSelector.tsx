import React, { useEffect, useState } from 'react'
import { IconContext } from 'react-icons';
import { BsArrowRightCircle, BsArrowLeftCircle } from 'react-icons/bs';
import { YearSelectorData } from '../Interfaces';
import YearSelectorStyle from '../styles/YearSelector.module.css'

// Could probably pick better arrow icons: https://react-icons.github.io/react-icons/search?q=arrow

export default function YearSelector(props: { yearSelector: any, yearSelectorData: YearSelectorData }) {
  const [displayedYear, setDisplayedYear]: any[] = useState(props.yearSelectorData.currentYear)
  const [rightArrowDisabled, setRightArrowDisabled] = useState(false)
  const [leftArrowDisabled, setLeftArrowDisabled] = useState(false)


  useEffect(() => {
    let lastYearValue = props.yearSelectorData.allYears[props.yearSelectorData.allYears.length - 1]
    let firstYearValue = props.yearSelectorData.allYears[0]
    if (lastYearValue == displayedYear) {
      setRightArrowDisabled(true)
    }
    if (firstYearValue == displayedYear) {
      setLeftArrowDisabled(true)
    }
  }, [displayedYear])

  function handleIncrement() {
    let lastYearValue = props.yearSelectorData.allYears[props.yearSelectorData.allYears.length - 1]
    if (displayedYear != lastYearValue) {
      let nextYear = props.yearSelectorData.allYears[props.yearSelectorData.allYears.indexOf(displayedYear) + 1]
      props.yearSelector(nextYear)
      setDisplayedYear(nextYear)
    }
    setLeftArrowDisabled(false)

  }
  function handleDecrement() {
    if (displayedYear != props.yearSelectorData.allYears[0]) {
      let lastYear = props.yearSelectorData.allYears[props.yearSelectorData.allYears.indexOf(displayedYear) - 1]
      props.yearSelector(lastYear)
      setDisplayedYear(lastYear)
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
      <div className={YearSelectorStyle.displayedYear}>{displayedYear}</div>
      <RightArrow />

    </div>
  )
}