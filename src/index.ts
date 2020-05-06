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

export enum OHLCVField {
  TIME = 0,
  OPEN = 1,
  HIGH = 2,
  LOW = 3,
  CLOSE = 4,
  VOLUME = 5
}

export type Trade = TradeTick;


export const batchCandleArray = (candledata: OHLCV[],
  baseFrame: number = 60,
  newFrame: number = 300): OHLCV[] => {

  baseFrame *= 1000;
  newFrame *= 1000;

  let convertRatio = Math.floor(newFrame / baseFrame);

  let result: OHLCV[] = [];

  if (convertRatio < 1) {
    throw new Error("Convert cannot be smaller than 1");
  }

  // Candledata Array check
  if (Array.isArray(candledata)) {
    if (candledata.length == 0 || candledata.length < convertRatio) {
      return result;
    }
  } else {
    throw new Error("Candledata is not an array!");
  }

  // Sort Data to ascending by Time
  candledata.sort((a, b) => a[OHLCVField.TIME] - b[OHLCVField.TIME]);

  // Buffer values
  let open = 0;
  let high = 0;
  let close = 0;
  let low = 0;
  let volume = 0;
  let timeOpen = 0;
  let j = 0;

  // Candledata [time,open,high,low,close,volume]
  //              0    1    2   3    4     5
  for (let i = 0; i < candledata.length; i++) {
    const candle = candledata[i];

    // Type convert
    candle[OHLCVField.TIME] = Number(candle[OHLCVField.TIME]);
    candle[OHLCVField.OPEN] = Number(candle[OHLCVField.OPEN]);
    candle[OHLCVField.HIGH] = Number(candle[OHLCVField.HIGH]);
    candle[OHLCVField.LOW] = Number(candle[OHLCVField.LOW]);
    candle[OHLCVField.CLOSE] = Number(candle[OHLCVField.CLOSE]);
    candle[OHLCVField.VOLUME] = Number(candle[OHLCVField.VOLUME]);

    //Get open values
    if (j == 0) {
      timeOpen = candle[OHLCVField.TIME];
      open = candle[OHLCVField.OPEN];
      low = candle[OHLCVField.LOW];
      volume = candle[OHLCVField.VOLUME];
    } else {
      // Add volume non open step
      volume += candle[OHLCVField.VOLUME];
    }
    // Count timeframe size
    j++;

    // Calculate low
    low = Math.min(candle[OHLCVField.LOW], low);
    // Calculate high
    high = Math.max(candle[OHLCVField.HIGH], high);

    // If we have too many skipped candle
    if (candle[OHLCVField.TIME] - timeOpen >= newFrame) {
      open = candle[OHLCVField.OPEN];
      low = candle[OHLCVField.LOW];
      high = candle[OHLCVField.HIGH];
      volume = candle[OHLCVField.VOLUME];
    }

    // When time is match with Time frame or we match the frame_lenght
    if (candle[OHLCVField.TIME] % newFrame == 0 || j >= convertRatio) {
      // Add result only if we match time frame
      if (candle[OHLCVField.TIME] % newFrame == 0) {
        // Close is always close
        close = candle[OHLCVField.CLOSE];
        result.push([candle[OHLCVField.TIME], open, high, low, close, volume]);
      }

      // Reset buffers
      open = high = close = low = volume = j = 0;
    }
  }

  return result;

}


export const batchCandleJSON = (candledata: IOHLCV[], baseFrame = 60, newFrame = 300): IOHLCV[] => {
  baseFrame *= 1000;
  newFrame *= 1000;

  let convertRatio = Math.floor(newFrame / baseFrame);

  let result: IOHLCV[] = [];

  if (convertRatio < 1) {
    throw "Target time frame must be a positive multiple of original timeframe";
  }

  // Candledata Array check
  if (Array.isArray(candledata)) {
    if (candledata.length == 0 || candledata.length < convertRatio) {
      return result;
    }
  } else {
    throw new Error("Candledata is not an array!");
  }

  // Sort Data to ascending
  candledata.sort((a, b) => a.time - b.time);

  // Buffer values
  let open = 0;
  let high = 0;
  let close = 0;
  let low = 0;
  let volume = 0;
  let timeOpen = 0;
  let j = 0;

  // Candledata [time,open,high,low,close,volume]
  //              0    1    2   3    4     5
  for (let i = 0; i < candledata.length; i++) {
    const candle = candledata[i];

    // Type convert
    candle.time = Number(candle.time);
    candle.open = Number(candle.open);
    candle.high = Number(candle.high);
    candle.low = Number(candle.low);
    candle.close = Number(candle.close);
    candle.volume = Number(candle.volume);

    //Get open values
    if (j == 0) {
      timeOpen = candle.time;
      open = candle.open;
      low = candle.low;
      volume = candle.volume;
    } else {
      // Add volume non open step
      volume += candle.volume;
    }
    // Count timeframe size
    j++;

    // Calculate low
    low = Math.min(candle.low, low);
    // Calculate high
    high = Math.max(candle.high, high);

    // If we have too many skipped candle
    if (candle.time - timeOpen >= newFrame) {
      open = candle.open;
      low = candle.low;
      high = candle.high;
      volume = candle.volume;
    }

    // When time is match with Timeframe or we match the
    if (candle.time % newFrame == 0 || j >= convertRatio) {
      // Add result only if we match time frame
      if (candle.time % newFrame == 0) {
        // Close is always close
        close = candle.close;
        result.push({ time: candle.time, open, high, low, close, volume });
      }

      // Reset buffers
      open = high = close = low = volume = j = 0;
    }
  }

  return result;
}


export const batchTicksToCandle = (tradedata: Trade[], interval: number = 60): IOHLCV[] => {
  interval *= Math.floor(1000);

  let result: IOHLCV[] = [];

  // Tradedata Array check
  if (Array.isArray(tradedata)) {
    if (tradedata.length == 0) {
      return result;
    }
  } else {
    throw new Error("Tradedata is not an array!");
  }

  // Sort Data to ascending
  tradedata.sort((a, b) => a.time - b.time);

  // Buffer values
  let open = 0;
  let high = 0;
  let close = 0;
  let low = 0;
  let volume = 0;
  let timeOpen = 0;
  let j = 0;

  // Tradedata [time,side,quantity,price,tradeid]
  //              0    1    2   3    4     5
  for (let i = 0; i < tradedata.length; i++) {
    const trade = tradedata[i];

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

    // We are still in the Candletime
    if (timeOpen == trade.time) {
      low = Math.min(trade.price, low);
      high = Math.max(trade.price, high);
      volume += trade.quantity;
      close = trade.price;
    } else {
      result.push({ time: timeOpen, open, high, low, close, volume });
      // Crate new candle
      timeOpen = trade.time;
      open = trade.price;
      low = trade.price;
      high = trade.price;
      close = trade.price;
      volume = trade.quantity;
    }
  }

  return result;
}


export const ticksToTickChart = (tradedata: Trade[], tickSize: number = 5): IOHLCV[] => {
  let result: IOHLCV[] = [];

  tickSize = Math.floor(tickSize);

  if (tickSize < 1) {
    throw new Error("Convert cannot be smaller than 1");
  }

  // Candledata Array check
  if (Array.isArray(tradedata)) {
    if (tradedata.length == 0 || tradedata.length < tickSize) {
      return result;
    }
  } else {
    throw new Error("Tradedata is not an array!");
  }

  // Sort Data to ascending
  tradedata.sort((a, b) => a.time - b.time);

  // Buffer values
  let open = 0;
  let high = 0;
  let close = 0;
  let low = 0;
  let volume = 0;
  let j = 0;

  // Tradedata [time,side,quantity,price,tradeId]
  //              0    1    2   3    4     5
  for (let i = 0; i < tradedata.length; i++) {
    const trade = tradedata[i];

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
    // Count timeframe size
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
}



export default {
  array: batchCandleArray,
  json: batchCandleJSON,
  trade_to_candle: batchTicksToCandle,
  tick_chart: ticksToTickChart
};
