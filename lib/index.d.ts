import { candletick } from "./interfaces";
export declare const convert: {
    candle_batch: (candledata: candletick[], baseFrame?: number, newFrame?: number) => candletick[];
    trade_to_candle: (tradedata: any, intverval?: number) => any[];
    tick_chart: (tradedata: any, tick_lenght?: number) => any[];
};
