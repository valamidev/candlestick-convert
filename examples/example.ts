import CConverter, { Trade } from "candlestick-convert";

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
  }
];

const baseFrame = 60; // 60 seconds
const newFrame = 120; // 120 seconds

// Convert to 2m Candles

const link_btc_2m = CConverter.json(link_btc_1m, baseFrame, newFrame);

console.log(link_btc_2m);

// Tick Chart

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
  }
];

// Remove unused values
const filtered_adabnb_trades: Trade[] = adabnb_trades.map((trade: any) => ({
  time: trade.time,
  quantity: trade.quantity,
  price: trade.price
}));

const batchSize = 2; // Every Candle consist 5 trade
const tickChart2 = CConverter.tick_chart(filtered_adabnb_trades, batchSize);

console.log(tickChart2);
