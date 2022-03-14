import React, { useState } from 'react'
import { IconContext } from 'react-icons';
import { BsArrowLeftSquare, BsArrowRightSquare } from 'react-icons/bs';
import { YearSelectorData } from '../Interfaces';

export default function YearSelector(props: {yearSelector: any, yearSelectorData: YearSelectorData} ) {
  const [displayedYear, setDisplayedYear]: any[] = useState(props.yearSelectorData.currentYear)


  function handleIncrement() {  // Currently skips years with no data, think this is the right way to go, but should show something about missing data in UI
    // Also, this aint it chief, find a better way to handle local displayed year value vs the actual year value from TotaltOversikt.tsx (prop value)
    // think there's a risk of the year shown in the graph data differs from the year displayed in the selector. 
    // essentially only line 15 or 16 should exist.
    if (displayedYear != props.yearSelectorData.allYears[ props.yearSelectorData.allYears.length - 1]) {
      props.yearSelector( props.yearSelectorData.allYears[ props.yearSelectorData.allYears.indexOf(displayedYear) + 1])
      setDisplayedYear(props.yearSelectorData.allYears[ props.yearSelectorData.allYears.indexOf(displayedYear) + 1])
    }
  }
  function handleDecrement() {
    if (displayedYear != props.yearSelectorData.allYears[0]) {
      props.yearSelector(props.yearSelectorData.allYears[props.yearSelectorData.allYears.indexOf(displayedYear) - 1])
      setDisplayedYear(props.yearSelectorData.allYears[props.yearSelectorData.allYears.indexOf(displayedYear) - 1])
    }
  }

  const RightArrow = () => {
    return (
      <IconContext.Provider
        value={{ color: 'black', size: '40px' }}
      >
        <div>
          <BsArrowRightSquare onClick={handleIncrement} />
        </div>
      </IconContext.Provider>
    );
  }

  const LeftArrow = () => {
    return (
      <IconContext.Provider
        value={{ color: 'black', size: '40px' }}
      >
        <div>
          <BsArrowLeftSquare onClick={handleDecrement} />
        </div>
      </IconContext.Provider>
    );
  }

  return (
    <div >
      <RightArrow /> 
      {displayedYear}
      <LeftArrow />
    </div>
  )
}