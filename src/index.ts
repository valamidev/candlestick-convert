import {candletick} from "./interfaces"


export const Converter = {


  candle_batch: (candledata: candletick[], baseFrame: number = 60, newFrame: number = 300) => {
    baseFrame *= 1000;
    newFrame *= 1000;

    const convertRatio = newFrame / baseFrame;

    const result: candletick[] = [];

    if (convertRatio < 1) {
      throw new Error("Convert cannot be smaller than 1");
    }

    // Candledata Size
      if (candledata.length === 0 || candledata.length < convertRatio) {
        return result;
      }
 

    // Sort Data to ascending
    candledata.sort((a, b) => a.time - b.time);

    // Buffer values
    let open = 0;
    let high = 0;
    let close = 0;
    let low = 0;
    let volume = 0;
    let openTime = 0;
    let j = 0;

    // Candledata [time,open,high,low,close,volume]
    //              0    1    2   3    4     5
    for (const candle of candledata) {
     
      // Get open values
      if (j === 0) {
        openTime = candle.time;
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
      if (candle.time - openTime >= newFrame) {
        open = candle.open;
        low = candle.low;
        high = candle.high;
        volume = candle.volume;
      }

      // When time is match with Timeframe or we match the frame_lenght
      if (candle.time % newFrame === 0 || j >= convertRatio) {
        // Add result only if we match timeframe
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
  },

  trade_to_candle: (tradedata: any, intverval = 60) => {
    intverval *= 1000;

    let result : any [] = [];

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
    let open_time = 0;
    let j = 0;

    // Tradedata [time,side,quantity,price,tradeid]
    //              0    1    2   3    4     5
    for (let i = 0; i < tradedata.length; i++) {
      const trade = tradedata[i];

      // Type convert
      trade.price = Number(trade.price);
      trade.quantity = Number(trade.quantity);
      trade.time = Number(trade.time) - (Number(trade.time) % intverval);

      // First Trade
      if (i == 0) {
        open_time = trade.time;
        open = trade.price;
        low = trade.price;
        high = trade.price;
        close = trade.price;
        volume = trade.quantity;
      }

      // We are still in the Candletime
      if (open_time == trade.time) {
        low = Math.min(trade.price, low);
        high = Math.max(trade.price, high);
        volume += trade.quantity;
        close = trade.price;
      } else {
        result.push({ time: open_time, open, high, low, close, volume });
        // Crate new candle
        open_time = trade.time;
        open = trade.price;
        low = trade.price;
        high = trade.price;
        close = trade.price;
        volume = trade.quantity;
      }
    }

    return result;
  },

  tick_chart: (tradedata: any, tick_lenght: number = 5) => {

    let result : any [] = [];

    tick_lenght = Math.trunc(tick_lenght);

    if (tick_lenght < 1) {
      throw new Error("Convert cannot be smaller than 1");
    }

    // Candledata Array check
    if (Array.isArray(tradedata)) {
      if (tradedata.length == 0 || tradedata.length < tick_lenght) {
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

    // Tradedata [time,side,quantity,price,tradeid]
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
      if (j >= tick_lenght) {
        // Close is always close
        close = trade.price;
        result.push({ time: trade.time, open, high, low, close, volume });

        // Reset buffers
        open = high = close = low = volume = j = 0;
      }
    }

    return result;
  }
};
