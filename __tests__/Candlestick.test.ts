"use strict";

import CConverter, { IOHLCV, batchCandleArray, OHLCV } from "../src/index";

// From Binance
const btc_usdt_1m: OHLCV[] = require('./fixtures/candlestick1m.json')
const btc_usdt_5m: OHLCV[] = require('./fixtures/candlestick5m.json')


test("Candle Convert 1m to 5m", () => {
  const candle5m = batchCandleArray(btc_usdt_1m, 60, 5 * 60);

  btc_usdt_5m.forEach((elem,i) => {
    const batchResult = candle5m.find((e) => e[0] === elem[0]);

    if(batchResult && i > 20){
      expect(Number(batchResult[1])).toEqual(Number(elem[1]));
      expect(Number(batchResult[2])).toEqual(Number(elem[2]));
      expect(Number(batchResult[3])).toEqual(Number(elem[3]));
      expect(Number(batchResult[4])).toEqual(Number(elem[4]));
      expect(Number(batchResult[5]).toFixed(4)).toEqual(Number(elem[5]).toFixed(4));
    }
  });

});


test("Candle Convert 1m to 5m with missing values", () => {

  const incompleteArray = [...btc_usdt_1m];

  incompleteArray.splice(6,1);
  incompleteArray.splice(13,1);
  incompleteArray.splice(22,1);

  const result = batchCandleArray(incompleteArray, 60, 5 * 60);

  expect(incompleteArray.length).toBeLessThan(btc_usdt_1m.length);
  expect(result).toHaveLength(6);
});




