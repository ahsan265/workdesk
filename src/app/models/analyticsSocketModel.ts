export interface analyticParamModel {
    time_range: string;
    languages: number[];
    countries: number[];
    type:string;
}

export interface barCountModel {
    date: string;
    count: number;
}
export interface barchartDataModel {
    answered: barCountModel[];
    handed_to_ai: barCountModel[];
    incoming: barCountModel[];
    missed: barCountModel[];
    num_bars: 7;
    type: string;
}
export interface cardCountModel {
    increase: number;
    count: number;
}
export interface cardDataModel {
    answered: cardCountModel;
    handed_to_ai: cardCountModel;
    incoming: cardCountModel;
    missed: cardCountModel;
    type: string;
}

