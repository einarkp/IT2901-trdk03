export interface Budget {
  school: number;
  date: Date;
  amount: number | null;
  prediction: number | null; 
}

export type TotalBudgetData = {
  school: number;
  date: Date;
  amount: number | null;
  budget: number;
  amountPrediction: number | null;
  budgetPrediction: number | null;
}

export type GraphDataProps = {
  data: Budget[],
};
