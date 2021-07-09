# candlestick-convert

[![Coverage Status](https://coveralls.io/repos/github/valamidev/candlestick-convert/badge.svg?branch=master)](https://coveralls.io/github/valamidev/candlestick-convert?branch=master)
[![DeepScan grade](https://deepscan.io/api/teams/6761/projects/8875/branches/113561/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6761&pid=8875&bid=113561)
![npm](https://img.shields.io/npm/dy/candlestick-convert)

This package allow you to batch OHLCV candlesticks or creating them from trade(tick) data sets.

#### Supported formats:

- OHLCV (CCXT format) `[[time,open,high,low,close,volume]]`
- OHLCV JSON `[{time: number,open: number, high: number, low: number close: number, volume: number}]`
- Trade JSON `[{price: number, quantity: number, time:number}]`

#### Features:

- Typescript support!
- CCXT support
- No Dependencies
- Performance single loop used
- Skip missing candles

#### Important!:

- Intervals only supported as second integers (1 minute = 60 , 2 minute = 120...)
- Only positive integer multiplication allowed between base interval and the new interval. e.g. 60->120, 60->180

#### Install:

```
npm install candlestick-convert
```

#### Available functions:
```javascript
import {batchCandleArray, batchCandleJSON, batchTicksToCandle, ticksToTickChart} from "candlestick-convert";

batchCandleArray(candledata: OHLCV[], baseInterval = 60, targetInterval = 300, includeOpenCandle = false) 
//return OHLCV[]

batchCandleJSON(candledata: IOHLCV [], 60, 300) 
// return IOHLCV[]

batchTicksToCandle(tradedata: TradeTick[], 60,  includeOpenCandle = false) 
// return IOHLCV[]

ticksToTickChart(tradedata: TradeTick[], 5) 
// return IOHLCV[]
```
** includeOpenCandle allow to add a lastCandle not full candle based on the available information


#### Types
```javascript
export type IOHLCV = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type OHLCV = [
  number,
  number,
  number,
  number,
  number,
  number,
]

export type TradeTick = {
  price: number;
  quantity: number;
  time: number;
}
```


## Examples

**CCXT OHLCV:**

```javascript
import {batchCandleJSON} from "candlestick-convert";

const link_btc_1m = [
  {
    time: 1563625680000,
    open: 0.00024824,
    high: 0.00024851,
    low: 0.00024798,
    close: 0.00024831,
    volume: 2264
  },
  {
    time: 1563625740000,
    open: 0.00024817,
    high: 0.00024832,
    low: 0.00024795,
    close: 0.00024828,
    volume: 3145
  }];

const baseFrame = 60; // 60 seconds
const newFrame = 120; // 120 seconds

// Convert to 2m Candles

const link_btc_2m = batchCandleJSON(link_btc_1m, baseFrame, newFrame);
```

**Tick Chart:**

```javascript
import {ticksToTickChart, TradeTick} from "candlestick-convert";

const adabnb_trades = [
  {
    time: "1564502620356",
    side: "sell",
    quantity: "4458",
    price: "0.00224",
    tradeId: "1221272"
  },
  {
    time: "1564503133949",
    side: "sell",
    quantity: "3480",
    price: "0.002242",
    tradeId: "1221273"
  },
  {
    time: "1564503134553",
    side: "buy",
    quantity: "51",
    price: "0.002248",
    tradeId: "1221274"
  }];


const filtered_adabnb_trades: TradeTick[] = adabnb_trades.map((trade: any) => ({
  time: trade.time,
  quantity: trade.quantity,
  price: trade.price
}));

const batchSize = 2; // Every TickCandle consist 2 trade
const tickChart = ticksToTickChart(filtered_adabnb_trades, batchSize);
```
