import React, { useState } from 'react'
import { IconContext } from 'react-icons';
import { BsArrowLeftSquare, BsArrowRightSquare } from 'react-icons/bs';
import { YearSelectorData } from '../Interfaces';

export default function YearSelector(yearSelectorData: any) {
  const [currentYear, setCurrentYear]: any[] = useState(yearSelectorData.data.currentYear)

  function handleIncrement() {  // Currently skips years with no data, think this is the right way to go, but should show something about missing data in UI
    if (currentYear != yearSelectorData.data.allYears[yearSelectorData.data.allYears.length - 1]) {
      setCurrentYear(yearSelectorData.data.allYears[yearSelectorData.data.allYears.indexOf(currentYear) + 1])
    }
  }
  function handleDecrement() {
    if (currentYear != yearSelectorData.data.allYears[0]) {
      setCurrentYear(yearSelectorData.data.allYears[yearSelectorData.data.allYears.indexOf(currentYear) - 1])
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
      {currentYear}
      <LeftArrow />

    </div>
  )
}