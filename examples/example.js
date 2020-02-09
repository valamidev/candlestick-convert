const CConverter = require("candlestick-convert").default;

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
