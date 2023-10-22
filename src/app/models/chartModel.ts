import { ChartData } from 'chart.js';

export interface chartModel {
  type: string;
  data: ChartData<'bar'>[];
}
