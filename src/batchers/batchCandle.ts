import { IntervalFunction, IOHLCV, OHLCV, OHLCVField } from "../interfaces";

export const batchCandles = (
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

export const batchCandlesWithCustomInterval = (
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

export const batchCandlesJSON = (
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

  const batchedOhlcvArray = batchCandles(ohlcvArray, baseFrame, newFrame);

  return batchedOhlcvArray.map((candle) => ({
    time: candle[OHLCVField.TIME],
    open: candle[OHLCVField.OPEN],
    high: candle[OHLCVField.HIGH],
    low: candle[OHLCVField.LOW],
    close: candle[OHLCVField.CLOSE],
    volume: candle[OHLCVField.VOLUME],
  }));
};
