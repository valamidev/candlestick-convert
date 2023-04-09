export type IOHLCV = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type OHLCV = [number, number, number, number, number, number];

export type TradeTick = {
  price: number;
  quantity: number;
  time: number;
};

export enum OHLCVField {
  TIME = 0,
  OPEN = 1,
  HIGH = 2,
  LOW = 3,
  CLOSE = 4,
  VOLUME = 5,
}

export type IntervalFunction = (timeStamp: number) => number;

export type Trade = TradeTick;

export const batchCandleArrayCustomInterval = (
  candleData: OHLCV[],
  intervalFunction: IntervalFunction,
  includeOpenCandle = false
): OHLCV[] => {
  const result: OHLCV[] = [];

  if (Array.isArray(candleData)) {
    if (candleData.length == 0) {
      return result;
    }
  } else {
    throw new Error("candleData is empty or not an array!");
  }

  // Sort Data to ascending by Time
  candleData.sort((a, b) => a[OHLCVField.TIME] - b[OHLCVField.TIME]);

  // Buffer values
  let open = 0;
  let high = 0;
  let close = 0;
  let low = 0;
  let volume = 0;
  let timeOpen = null;
  let j = 0;

  for (let i = 0; i < candleData.length; i++) {
    const candle = candleData[i];

    // Type convert
    candle[OHLCVField.TIME] = Number(candle[OHLCVField.TIME]);
    candle[OHLCVField.OPEN] = Number(candle[OHLCVField.OPEN]);
    candle[OHLCVField.HIGH] = Number(candle[OHLCVField.HIGH]);
    candle[OHLCVField.LOW] = Number(candle[OHLCVField.LOW]);
    candle[OHLCVField.CLOSE] = Number(candle[OHLCVField.CLOSE]);
    candle[OHLCVField.VOLUME] = Number(candle[OHLCVField.VOLUME]);

    // First / Force New Candle
    if (timeOpen === null) {
      timeOpen = intervalFunction(candle[OHLCVField.TIME]);

      open = candle[OHLCVField.OPEN];
      high = candle[OHLCVField.HIGH];
      low = candle[OHLCVField.LOW];
      close = candle[OHLCVField.CLOSE];
      volume = 0;
      j = 1;
    }

    // New Candle
    if (intervalFunction(candle[OHLCVField.TIME]) !== timeOpen) {
      result.push([timeOpen, open, high, low, close, volume]);

      timeOpen = intervalFunction(candle[OHLCVField.TIME]);
      open = candle[OHLCVField.OPEN];
      high = candle[OHLCVField.HIGH];
      low = candle[OHLCVField.LOW];
      close = candle[OHLCVField.CLOSE];
      volume = 0;
      j = 1;
    }

    high = Math.max(candle[OHLCVField.HIGH], high);
    low = Math.min(candle[OHLCVField.LOW], low);
    close = candle[OHLCVField.CLOSE];
    volume = volume + candle[OHLCVField.VOLUME];

    if (i === candleData.length - 1 && includeOpenCandle) {
      result.push([timeOpen, open, high, low, close, volume]);
    }

    j = j + 1;
  }

  return result;
};

export const batchCandleArray = (
  candleData: OHLCV[],
  baseFrame: number = 60,
  newFrame: number = 300,
  includeOpenCandle = false
): OHLCV[] => {
  const result: OHLCV[] = [];
  baseFrame *= 1000;
  newFrame *= 1000;

  const convertRatio = Math.floor(newFrame / baseFrame);

  if (convertRatio % 1 !== 0) {
    throw new Error("Convert ratio should integer an >= 2");
  }

  if (Array.isArray(candleData)) {
    if (candleData.length == 0 || candleData.length < convertRatio) {
      return result;
    }
  } else {
    throw new Error("candleData is empty or not an array!");
  }

  // Sort Data to ascending by Time
  candleData.sort((a, b) => a[OHLCVField.TIME] - b[OHLCVField.TIME]);

  // Buffer values
  let open = 0;
  let high = 0;
  let close = 0;
  let low = 0;
  let volume = 0;
  let timeOpen = null;
  let j = 0;

  for (let i = 0; i < candleData.length; i++) {
    const candle = candleData[i];

    // Type convert
    candle[OHLCVField.TIME] = Number(candle[OHLCVField.TIME]);
    candle[OHLCVField.OPEN] = Number(candle[OHLCVField.OPEN]);
    candle[OHLCVField.HIGH] = Number(candle[OHLCVField.HIGH]);
    candle[OHLCVField.LOW] = Number(candle[OHLCVField.LOW]);
    candle[OHLCVField.CLOSE] = Number(candle[OHLCVField.CLOSE]);
    candle[OHLCVField.VOLUME] = Number(candle[OHLCVField.VOLUME]);

    // First / Force New Candle
    if (timeOpen === null) {
      timeOpen = candle[OHLCVField.TIME];

      if (candle[OHLCVField.TIME] % newFrame > 0) {
        timeOpen =
          candle[OHLCVField.TIME] - (candle[OHLCVField.TIME] % newFrame);
      }

      open = candle[OHLCVField.OPEN];
      high = candle[OHLCVField.HIGH];
      low = candle[OHLCVField.LOW];
      close = candle[OHLCVField.CLOSE];
      volume = 0;
      j = 1;
    }

    // New Candle
    if (
      candle[OHLCVField.TIME] - (candle[OHLCVField.TIME] % newFrame) !==
      timeOpen
    ) {
      result.push([timeOpen, open, high, low, close, volume]);

      timeOpen = candle[OHLCVField.TIME] - (candle[OHLCVField.TIME] % newFrame);
      open = candle[OHLCVField.OPEN];
      high = candle[OHLCVField.HIGH];
      low = candle[OHLCVField.LOW];
      close = candle[OHLCVField.CLOSE];
      volume = 0;
      j = 1;
    }

    high = Math.max(candle[OHLCVField.HIGH], high);
    low = Math.min(candle[OHLCVField.LOW], low);
    close = candle[OHLCVField.CLOSE];
    volume = volume + candle[OHLCVField.VOLUME];

    // Batch counter
    if (j === convertRatio) {
      result.push([timeOpen, open, high, low, close, volume]);
      timeOpen = null;
    } else if (includeOpenCandle === true && i == candleData.length - 1) {
      // Allow OpenCandles
      result.push([timeOpen, open, high, low, close, volume]);
      timeOpen = null;
    }

    j = j + 1;
  }

  return result;
};

export const batchCandleJSON = (
  candleData: IOHLCV[],
  baseFrame = 60,
  newFrame = 300
): IOHLCV[] => {
  const ohlcvArray: OHLCV[] = candleData.map((e) => [
    e.time,
    e.open,
    e.high,
    e.low,
    e.close,
    e.volume,
  ]);

  const batchedOhlcvArray = batchCandleArray(ohlcvArray, baseFrame, newFrame);

  return batchedOhlcvArray.map((candle) => ({
    time: candle[OHLCVField.TIME],
    open: candle[OHLCVField.OPEN],
    high: candle[OHLCVField.HIGH],
    low: candle[OHLCVField.LOW],
    close: candle[OHLCVField.CLOSE],
    volume: candle[OHLCVField.VOLUME],
  }));
};

export const batchTicksToCandle = (
  tradeData: Trade[],
  interval: number = 60,
  includeOpenCandle = false,
  filterFn?: (trade: Trade) => boolean
): IOHLCV[] => {
  interval *= Math.floor(1000);

  let result: IOHLCV[] = [];

  // Tradedata Array check
  if (Array.isArray(tradeData)) {
    if (tradeData.length == 0) {
      return result;
    }
  } else {
    throw new Error("Tradedata is not an array!");
  }

  // Sort Data to ascending
  tradeData.sort((a, b) => a.time - b.time);

  if (filterFn) {
    tradeData = tradeData.filter((e) => filterFn(e));
  }

  // Buffer values
  let open = 0;
  let high = 0;
  let close = 0;
  let low = 0;
  let volume = 0;
  let timeOpen = 0;
  let previousClose = null;

  // TradeData [time,side,quantity,price,tradeId]
  //              0    1    2   3    4     5
  for (let i = 0; i < tradeData.length; i++) {
    const trade = tradeData[i];

    // Type convert
    trade.price = Number(trade.price);
    trade.quantity = Number(trade.quantity);
    trade.time = Number(trade.time) - (Number(trade.time) % interval);

    // First Trade
    if (i == 0) {
      timeOpen = trade.time;
      open = trade.price;
      low = trade.price;
      high = trade.price;
      close = trade.price;
      volume = trade.quantity;
    }

    // We are still in the CandleTime
    if (timeOpen == trade.time) {
      low = Math.min(trade.price, low);
      high = Math.max(trade.price, high);
      volume += trade.quantity;
      close = trade.price;
    } else {
      result.push({ time: timeOpen, open, high, low, close, volume });
      // Create new candle
      timeOpen = trade.time;
      open = previousClose || trade.price;
      low = trade.price;
      high = trade.price;
      close = trade.price;
      volume = trade.quantity;
    }
    previousClose = close;
  }

  if (previousClose && includeOpenCandle) {
    result.push({ time: timeOpen, open, high, low, close, volume });
  }

  return result;
};

export const ticksToTickChart = (
  tradeData: Trade[],
  tickSize: number = 5
): IOHLCV[] => {
  let result: IOHLCV[] = [];

  tickSize = Math.floor(tickSize);

  if (tickSize < 1) {
    throw new Error("Convert cannot be smaller than 1");
  }

  // candleData Array check
  if (Array.isArray(tradeData)) {
    if (tradeData.length == 0 || tradeData.length < tickSize) {
      return result;
    }
  } else {
    throw new Error("TradeData is not an array!");
  }

  // Sort Data to ascending
  tradeData.sort((a, b) => a.time - b.time);

  // Buffer values
  let open = 0;
  let high = 0;
  let close = 0;
  let low = 0;
  let volume = 0;
  let j = 0;

  // TradeData [time,side,quantity,price,tradeId]
  //              0    1    2   3    4     5
  for (let i = 0; i < tradeData.length; i++) {
    const trade = tradeData[i];

    // Type convert
    trade.price = Number(trade.price);
    trade.quantity = Number(trade.quantity);
    trade.time = Number(trade.time);

    //Get open values
    if (j == 0) {
      open = trade.price;
      low = trade.price;
      high = trade.price;
      volume = trade.quantity;
    } else {
      // Add volume non open step
      volume += trade.quantity;
    }
    // Count timeFrame size
    j++;

    // Calculate low
    low = Math.min(trade.price, low);
    // Calculate high
    high = Math.max(trade.price, high);

    // Tick interval reached
    if (j >= tickSize) {
      // Close is always close
      close = trade.price;
      result.push({ time: trade.time, open, high, low, close, volume });

      // Reset buffers
      open = high = close = low = volume = j = 0;
    }
  }

  return result;
};

export default {
  array: batchCandleArray,
  arrayCustomInterval: batchCandleArrayCustomInterval,
  json: batchCandleJSON,
  trade_to_candle: batchTicksToCandle,
  tick_chart: ticksToTickChart,
};
