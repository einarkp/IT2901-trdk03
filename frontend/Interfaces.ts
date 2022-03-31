export interface Budget {
  school: number;
  date: Date;
  amount: number | null;
  prediction: number | null; 
  uncertainty: number[] | null;
  cumulativeUncertainty: number[] | null;
}
export interface LoginDetails {
  user?: User,
  token?: string,
  successful?: boolean,
  expiry?: string,
};
export type TotalBudgetData = {
  school: number;
  date: Date;
  amount: number | null;
  budget: number;
  amountPrediction: number | null;
  budgetPrediction: number | null;
}

export interface combinedBudgetData {
  school: number;
  date: Date;
  accounting: number | null;
  oldAccounting: number | null;
  cumulativeAccounting: number | null;
  cumulativeOldAccounting: number | null;
  accountingPrediction: number | null;
  cumulativeAccountingPrediction: number | null;
  budget: any;
  oldBudget: any;
  uncertainty: (number | null)[];
  cumulativeUncertainty: (number | null)[];

}

export type User = {
  username: string,
  schoolID: string | number,
  token?: string,
  id: number,
  user_type: string
}


export type GraphDataProps = {
  data: Budget[],
};

export type GraphInfoProps = {
  result: boolean,
  resultPercent: number | null,
  withinMargin: boolean | null,
  bestMonth: string,
  worstMonth: string,
  maxMonthUse: string,
};

export type YearSelectorData = {
  allYears: Number[],
  currentYear: Number,
}

export type PupilBackendObject = {
  school: number,
  year: string, // <-- this is a string with format "2022-01-01"
  spring: number, // Amount of students spring semester for this year and grade
  autumn: number,
  grade: number // 1-10
}

export type SemesterSelectorData = {
  allSemesters: string[],
  currentSemester: string,
}

export type GraphProps = {
  data: Budget[],
  oldData: Budget[],
  info: GraphInfoProps,
  setCurrentYear: (param: any) => void,  // TODO: look into replacing this with React.Dispatch<React.SetStateAction<number>>, or something similair
  yearSelectorData: YearSelectorData
};

export type AllDataApiResponse = {
  Accounting: {school: number, date: string, amount: number}[],
  Budget: {school: number, date: string, amount: number}[],
  BudgetChange: {school: number, date: string, amount: number}[],
  Prognosis: {school: number, date: string, amount: number}[],
  Prediction: {school: number, date: string, amount: number}[]
};

export type PercentageProps = {
  amount: any,
  percent: number,
}

