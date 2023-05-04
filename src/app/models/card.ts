export interface Card {
  icon: string;
  title: string;
  color: string;
  mainResult: number;
  secondResultText?: string;
  secondResultNumber: number;
  iconUp?: string;
  iconDown?: string;
}

export interface cardTypeModel {
  type: string;
  data: Card[];
}