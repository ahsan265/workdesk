export interface tickerModel {
    name: string;
    mainHeading: string;
    text: string;
    tickers: tickers[];
}
export interface tickers {
    header: string,
    value: number,
    min: number,
    max: number,
}

export interface SplittedTimeModel {
    type: string;
    time: timer;

}
export interface timer {
    h: number,
    min: number,
    sec: number,
}
