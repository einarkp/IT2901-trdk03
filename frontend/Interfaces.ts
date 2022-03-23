export interface Budget {
  school: number;
  date: Date;
  amount: number | null;
  prediction: number | null; 
  uncertainty: number[] | null;
  cumulativeUncertainty: number[] | null;
}
export interface LoginDetails {
  user?: string,
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
export type User = {
  username: string,
  schoolID: string | number,
  token: string,
  type: UserTypes
}
export enum UserTypes {
  normal,
  admin
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

