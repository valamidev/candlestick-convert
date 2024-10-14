"use strict";

import {
  batchTicksToCandle,
  batchTradeToExtCandle,
  Trade,
  TradeTick,
} from "../src";

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
  {
    time: "1564503137460",
    side: "buy",
    quantity: "52",
    price: "0.002248",
    tradeId: "1221275",
  },
  {
    time: "1564503137490",
    side: "sell",
    quantity: "1366",
    price: "0.002248",
    tradeId: "1221276",
  },
  {
    time: "1564503320756",
    side: "sell",
    quantity: "16991",
    price: "0.002244",
    tradeId: "1221277",
  },
  {
    time: "1564503321803",
    side: "sell",
    quantity: "2164",
    price: "0.002244",
    tradeId: "1221278",
  },
  {
    time: "1564503324289",
    side: "sell",
    quantity: "1966",
    price: "0.002243",
    tradeId: "1221279",
  },
  {
    time: "1564503456291",
    side: "buy",
    quantity: "5277",
    price: "0.002249",
    tradeId: "1221280",
  },
  {
    time: "1564503468749",
    side: "buy",
    quantity: "1169",
    price: "0.002248",
    tradeId: "1221281",
  },
  {
    time: "1564503547676",
    side: "buy",
    quantity: "652",
    price: "0.00225",
    tradeId: "1221282",
  },
  {
    time: "1564503891110",
    side: "sell",
    quantity: "712",
    price: "0.002245",
    tradeId: "1221283",
  },
  {
    time: "1564504355614",
    side: "buy",
    quantity: "327",
    price: "0.00225",
    tradeId: "1221284",
  },
  {
    time: "1564504451680",
    side: "buy",
    quantity: "1055",
    price: "0.00225",
    tradeId: "1221285",
  },
  {
    time: "1564504631987",
    side: "sell",
    quantity: "1522",
    price: "0.002247",
    tradeId: "1221286",
  },
  {
    time: "1564504713188",
    side: "sell",
    quantity: "79",
    price: "0.002246",
    tradeId: "1221287",
  },
  {
    time: "1564504713223",
    side: "buy",
    quantity: "1160",
    price: "0.002246",
    tradeId: "1221288",
  },
  {
    time: "1564504713227",
    side: "buy",
    quantity: "1623",
    price: "0.002246",
    tradeId: "1221289",
  },
  {
    time: "1564504724336",
    side: "buy",
    quantity: "89",
    price: "0.002246",
    tradeId: "1221290",
  },
  {
    time: "1564504753820",
    side: "buy",
    quantity: "269",
    price: "0.002246",
    tradeId: "1221291",
  },
  {
    time: "1564504794001",
    side: "sell",
    quantity: "1781",
    price: "0.002245",
    tradeId: "1221292",
  },
  {
    time: "1564505361033",
    side: "sell",
    quantity: "218",
    price: "0.002246",
    tradeId: "1221293",
  },
  {
    time: "1564505487939",
    side: "buy",
    quantity: "60",
    price: "0.002251",
    tradeId: "1221294",
  },
  {
    time: "1564505490350",
    side: "sell",
    quantity: "224",
    price: "0.002251",
    tradeId: "1221295",
  },
  {
    time: "1564505762661",
    side: "buy",
    quantity: "1054",
    price: "0.002251",
    tradeId: "1221296",
  },
  {
    time: "1564505771404",
    side: "buy",
    quantity: "5519",
    price: "0.002251",
    tradeId: "1221297",
  },
  {
    time: "1564506180490",
    side: "sell",
    quantity: "238",
    price: "0.002241",
    tradeId: "1221298",
  },
  {
    time: "1564506627951",
    side: "sell",
    quantity: "7249",
    price: "0.00224",
    tradeId: "1221299",
  },
  {
    time: "1564506666840",
    side: "sell",
    quantity: "60",
    price: "0.002239",
    tradeId: "1221300",
  },
  {
    time: "1564506666840",
    side: "sell",
    quantity: "7443",
    price: "0.002238",
    tradeId: "1221301",
  },
  {
    time: "1564506666866",
    side: "buy",
    quantity: "724",
    price: "0.002237",
    tradeId: "1221302",
  },
  {
    time: "1564507605470",
    side: "sell",
    quantity: "706",
    price: "0.002244",
    tradeId: "1221303",
  },
  {
    time: "1564508193610",
    side: "buy",
    quantity: "1621",
    price: "0.00225",
    tradeId: "1221304",
  },
  {
    time: "1564508200723",
    side: "buy",
    quantity: "533",
    price: "0.00225",
    tradeId: "1221305",
  },
  {
    time: "1564508212153",
    side: "sell",
    quantity: "4322",
    price: "0.002248",
    tradeId: "1221306",
  },
  {
    time: "1564508212158",
    side: "sell",
    quantity: "6239",
    price: "0.002248",
    tradeId: "1221307",
  },
  {
    time: "1564508212163",
    side: "sell",
    quantity: "2784",
    price: "0.002248",
    tradeId: "1221308",
  },
  {
    time: "1564508495720",
    side: "buy",
    quantity: "5150",
    price: "0.002246",
    tradeId: "1221309",
  },
  {
    time: "1564508495720",
    side: "buy",
    quantity: "7328",
    price: "0.002247",
    tradeId: "1221310",
  },
  {
    time: "1564508585720",
    side: "buy",
    quantity: "120",
    price: "0.002245",
    tradeId: "1221311",
  },
  {
    time: "1564508625642",
    side: "buy",
    quantity: "200",
    price: "0.002249",
    tradeId: "1221312",
  },
  {
    time: "1564509238524",
    side: "buy",
    quantity: "60",
    price: "0.002251",
    tradeId: "1221313",
  },
  {
    time: "1564509271956",
    side: "buy",
    quantity: "55",
    price: "0.002254",
    tradeId: "1221314",
  },
  {
    time: "1564509333026",
    side: "buy",
    quantity: "1407",
    price: "0.002254",
    tradeId: "1221315",
  },
  {
    time: "1564509465425",
    side: "sell",
    quantity: "3097",
    price: "0.002246",
    tradeId: "1221317",
  },
  {
    time: "1564509465425",
    side: "sell",
    quantity: "1903",
    price: "0.00225",
    tradeId: "1221316",
  },
  {
    time: "1564509510570",
    side: "sell",
    quantity: "2485",
    price: "0.002247",
    tradeId: "1221318",
  },
  {
    time: "1564509510570",
    side: "sell",
    quantity: "2515",
    price: "0.002246",
    tradeId: "1221319",
  },
  {
    time: "1564509559380",
    side: "sell",
    quantity: "3645",
    price: "0.002251",
    tradeId: "1221320",
  },
  {
    time: "1564509559380",
    side: "sell",
    quantity: "6513",
    price: "0.002249",
    tradeId: "1221321",
  },
  {
    time: "1564509797843",
    side: "buy",
    quantity: "50",
    price: "0.002254",
    tradeId: "1221322",
  },
];

const filtered_adabnb_trades: Trade[] = adabnb_trades.map((trade: any) => ({
  time: trade.time,
  quantity: trade.quantity,
  price: trade.price,
  side: trade.side === "buy" ? 0 : 1,
}));

test("Trades convert to Candlestick", () => {
  let result = batchTradeToExtCandle(filtered_adabnb_trades, 60);

  expect(result[0]).toEqual({
    time: 1564502580000, // 2019-07-30T16:03:00.000Z
    open: 0.00224,
    high: 0.00224,
    low: 0.00224,
    close: 0.00224,
    volume: 4458,
    buyVolume: 0,
    tx: 1,
    buyTx: 0,
  });

  expect(result[1]).toEqual({
    buyTx: 2,
    buyVolume: 103,
    close: 0.002248,
    high: 0.002248,
    low: 0.002242,
    open: 0.00224,
    time: 1564503120000,
    tx: 3,
    volume: 4949,
  });

  expect(result[2]).toEqual({
    buyTx: 0,
    buyVolume: 0,
    close: 0.002243,
    high: 0.002244,
    low: 0.002243,
    open: 0.002248,
    time: 1564503300000,
    tx: 2,
    volume: 21121,
  });

  // 27 candles, without open (unfinished) candle
  expect(result.length).toBe(27);

  expect(result[26].time).toEqual(1564509540000); // 2019-07-30T17:59:00.000Z
});

test("Trades convert to Candlestick, with filter", () => {
  let result = batchTradeToExtCandle(
    filtered_adabnb_trades,
    60,
    false,
    (trade: TradeTick) => {
      return trade.quantity > 100;
    }
  );

  expect(result[0]).toEqual({
    time: 1564502580000, // 2019-07-30T16:03:00.000Z
    open: 0.00224,
    high: 0.00224,
    low: 0.00224,
    close: 0.00224,
    volume: 4458,
    buyVolume: 0,
    tx: 1,
    buyTx: 0,
  });

  // 24 candles, without open (unfinished) candle
  expect(result.length).toBe(24);

  expect(result[23].time).toEqual(1564509480000);
});

test("Trades convert to Candlestick – including open candle", () => {
  let result = batchTradeToExtCandle(filtered_adabnb_trades, 60, true);

  // 27+1 candles, including open (unfinished) candle
  expect(result.length).toBe(28);

  expect(result[27].time).toEqual(1564509780000); // 2019-07-30T18:03:00.000Z
});
