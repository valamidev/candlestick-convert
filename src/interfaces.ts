export interface candletick {
    time: number,
    open: number,
    high: number,
    low: number,
    close: number
    volume: number
}

export enum Errors {
    CANDLEDATA_NOT_ARRAY = "Candledata is not an array!"
}