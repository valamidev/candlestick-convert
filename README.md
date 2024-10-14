# candlestick-convert

[![Coverage Status](https://coveralls.io/repos/github/valamidev/candlestick-convert/badge.svg?branch=master)](https://coveralls.io/github/valamidev/candlestick-convert?branch=master)
[![DeepScan grade](https://deepscan.io/api/teams/6761/projects/8875/branches/113561/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6761&pid=8875&bid=113561)
![npm](https://img.shields.io/npm/dy/candlestick-convert)

This package allows you to batch OHLCV candlesticks or create them from trade (tick) datasets.

#### Breaking Changes

Version 7.x introduces many breaking changes compared to version 6.x.x.

#### Supported formats:

- OHLCV (CCXT format) `[[time,open,high,low,close,volume]]`
- OHLCV JSON `[{time: number,open: number, high: number, low: number close: number, volume: number}]`
- Tick JSON `[{price: number, quantity: number, time:number}]`
- Trade JSON `[{price: number, quantity: number, time:number, side: number}]`

#### Features:

- Typescript
- CCXT support
- No Dependencies
- Performance single loop used
- Skip missing candles

#### Important!:

- Intervals are only supported as integers in seconds (1 minute = 60, 2 minutes = 120...).
- Only positive integer multiples are allowed between the base interval and the new interval, e.g., 60->120, 60->180.

#### Install:

```
npm install candlestick-convert
```

#### Available functions:

```javascript
import {batchCandles, batchCandlesWithCustomInterval, batchCandlesJSON, batchTicksToCandle, ticksToTickChart} from "candlestick-convert";

batchCandles(candledata: OHLCV[], baseInterval = 60, targetInterval = 300, includeOpenCandle = false)
//return OHLCV[]

batchCandlesWithCustomInterval(candleData: OHLCV[], intervalFunction: IntervalFunction, includeOpenCandle = false)
//return OHLCV[]

batchCandlesJSON(candledata: IOHLCV [], baseInterval = 60, argetInterval = 300)
// return IOHLCV[]

batchTicksToCandle(tradedata: TradeTick[], interval = 60,  includeOpenCandle = false)
// return IOHLCV[]

ticksToTickChart(tradedata: TradeTick[], numberOfTicks = 5)
// return IOHLCV[]

batchTradeToExtCandle(tradedata: Trade[], interval = 60,  includeOpenCandle = false)
// return ExtIOHLCV[]
```

\*\* includeOpenCandle allow non-complete candles in the result, useful for not normalized input data

#### Types

```javascript
export type IOHLCV = {
  time: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
};

export type ExtIOHLCV = {
  time: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
  buyVolume: number,
  tx: number,
  buyTx: number,
};

export const TradeSide = {
  BUY: 0,
  SELL: 1,
};

export type TradeTick = {
  price: number;
  quantity: number;
  time: number;
};

export type Trade = {
  price: number;
  quantity: number;
  time: number;
  side: number;
};

export enum OHLCVField {
  TIME = 0,
  OPEN = 1,
  HIGH = 2,
  LOW = 3,
  CLOSE = 4,
  VOLUME = 5,
}
```

## Examples

**CCXT OHLCV:**

```javascript
import { batchCandleJSON } from "candlestick-convert";

const link_btc_1m = [
  {
    time: 1563625680000,
    open: 0.00024824,
    high: 0.00024851,
    low: 0.00024798,
    close: 0.00024831,
    volume: 2264,
  },
  {
    time: 1563625740000,
    open: 0.00024817,
    high: 0.00024832,
    low: 0.00024795,
    close: 0.00024828,
    volume: 3145,
  },
];

const baseFrame = 60; // 60 seconds
const newFrame = 120; // 120 seconds

// Convert to 2m Candles

const link_btc_2m = batchCandleJSON(link_btc_1m, baseFrame, newFrame);
```

**Extended Candles from Trades:**

```javascript
import { batchTradeToExtCandle, Trade } from "candlestick-convert";

const adabnb_trades = [
  {
    time: "1564502620356",
    side: "sell",
    quantity: "4458",
    price: "0.00224",
    tradeId: "1221272",
  },
  {
    time: "1564503133949",
    side: "sell",
    quantity: "3480",
    price: "0.002242",
    tradeId: "1221273",
  },
  {
    time: "1564503134553",
    side: "buy",
    quantity: "51",
    price: "0.002248",
    tradeId: "1221274",
  },
  // ... more data
];

const filtered_adabnb_trades: Trade[] = adabnb_trades.map((trade: any) => ({
  time: trade.time,
  quantity: trade.quantity,
  price: trade.price,
  side: trade.side === "buy" ? 0 : 1,
}));

// 1 minute (60 second) Candles
const candles1m = batchTradeToExtCandle(filtered_adabnb_trades, 60);

/* Result:
[
  {
    time: 1564502580000, // 2019-07-30T16:03:00.000Z
    open: 0.00224,
    high: 0.00224,
    low: 0.00224,
    close: 0.00224,
    volume: 4458,
    buyVolume: 0,
    tx: 1,
    buyTx: 0,
  },
  {
    time: 1564503120000,
    open: 0.00224,
    high: 0.002248,
    low: 0.002242,
    close: 0.002248,
    volume: 4949,
    buyVolume: 103,
    tx: 3,
    buyTx: 2,
  }
]


```
