const defaultWidgetData: any = {
    mainHeading: 'Wait time',
    text: 'Set how long it takes for the Agent to respond to a request.',
    tickers: [{
        header: 'h',
        value: "0",
        min: "0",
        max: "24",
    },
    {
        header: 'min',
        value: "0",
        min: "0",
        max: "60",
    },
    {
        header: 'sec',
        value: "0",
        min: "0",
        max: "60",
    }]
}
export {
    defaultWidgetData
}