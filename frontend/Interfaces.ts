export interface Budget {
  school: number;
  date: Date;
  amount: Number;
}

export type GraphDataProps = {
  data: Budget[],
};
