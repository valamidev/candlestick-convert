# candlestick-convert

This package allow you to convert or batch OHLCV candlestick charts or creating them from trade data sets.

**Supported formats:**

- OHLCV Array `[[time,open,high,low,close,volume]]`
- OHLCV JSON `[{time: number,open: number, high: number, low: number close: number, volume: number}]`
- Trade JSON `[{price: number, quantity: number, time:number}]`

**Features:**

- Typescript support!
- CCXT support
- No Dependencies
- Performance single loop used
- Skip missing candles

**Important!:**

- Intervals only supported as second integers (1 minute = 60 , 2 minute = 120...)
- Only positive integer multiplication allowed between base interval and the new interval. e.g. 60->120, 60->180

**Install:**

```
npm install candlestick-convert
```

**Available functions:**

```
import CConverter from "candlestick-convert";
// const CConverter = require('candlestick-convert').default;

CConverter.array(candledata: number[][], 60, 300) // return number[][]
CConverter.json(candledata: OHLCV [], 60, 300) // return OHLCV[]
CConverter.trade_to_candle(tradedata: Trade[], 60) // return OHLCV[]
CConverter.tick_chart(tradedata: Trade[], 5) // return OHLCV[]

```

## Examples

**CCXT OHLCV (Typescript):**

```
import CConverter from "candlestick-convert";

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

const link_btc_2m = CConverter.json(link_btc_1m, baseFrame, newFrame);
```

**Tick Chart (Typescript):**

```
import CConverter, { Trade } from "../src/index";

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

// Remove unused values ()

const filtered_adabnb_trades: Trade[] = adabnb_trades.map((trade: any) => ({
  time: trade.time,
  quantity: trade.quantity,
  price: trade.price
}));

const batchSize = 2; // Every Candle consist 2 trade
const tickChart2 = CConverter.tick_chart(filtered_adabnb_trades, batchSize);
```
