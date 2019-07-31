"use strict";

const convert = {
  array: (candledata, base_frame = 60, new_frame = 300) => {
    base_frame *= 1000;
    new_frame *= 1000;

    let convert_ratio = parseInt(new_frame / base_frame);

    let result = [];

    if (convert_ratio < 1) {
      throw "Convert cannot be smaller than 1";
    }

    // Candledata Array check
    if (Array.isArray(candledata)) {
      if (candledata.length == 0 || candledata.length < convert_ratio) {
        return result;
      }
    } else {
      throw new Error("Candledata is not an array!");
    }

    // Sort Data to ascending
    candledata.sort((a, b) => a[0] - b[0]);

    // Buffer values
    let open = 0;
    let high = 0;
    let close = 0;
    let low = 0;
    let volume = 0;
    let open_time = 0;
    let j = 0;

    // Candledata [time,open,high,low,close,volume]
    //              0    1    2   3    4     5
    for (let i = 0; i < candledata.length; i++) {
      const candle = candledata[i];

      // Type convert
      candle[0] = Number(candle[0]);
      candle[1] = Number(candle[1]);
      candle[2] = Number(candle[2]);
      candle[3] = Number(candle[3]);
      candle[4] = Number(candle[4]);
      candle[5] = Number(candle[5]);

      //Get open values
      if (j == 0) {
        open_time = candle[0];
        open = candle[1];
        low = candle[3];
        volume = candle[5];
      } else {
        // Add volume non open step
        volume += candle[5];
      }
      // Count timeframe size
      j++;

      // Calculate low
      low = Math.min(candle[3], low);
      // Calculate high
      high = Math.max(candle[2], high);

      // If we have too many skipped candle
      if (candle[0] - open_time >= new_frame) {
        open = candle[1];
        low = candle[3];
        high = candle[2];
        volume = candle[5];
      }

      // When time is match with Timeframe or we match the frame_lenght
      if (candle[0] % new_frame == 0 || j >= convert_ratio) {
        // Add result only if we match timeframe
        if (candle[0] % new_frame == 0) {
          // Close is always close
          close = candle[4];
          result.push([candle[0], open, high, low, close, volume]);
        }

        // Reset buffers
        open = high = close = low = volume = j = 0;
      }
    }

    return result;
  },

  json: (candledata, base_frame = 60, new_frame = 300) => {
    base_frame *= 1000;
    new_frame *= 1000;

    let convert_ratio = parseInt(new_frame / base_frame);

    let result = [];

    if (convert_ratio < 1) {
      throw "Convert cannot be smaller than 1";
    }

    // Candledata Array check
    if (Array.isArray(candledata)) {
      if (candledata.length == 0 || candledata.length < convert_ratio) {
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
    let open_time = 0;
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
        open_time = candle.time;
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
      if (candle[0] - open_time >= new_frame) {
        open = candle.open;
        low = candle.low;
        high = candle.high;
        volume = candle.volume;
      }

      // When time is match with Timeframe or we match the frame_lenght
      if (candle.time % new_frame == 0 || j >= convert_ratio) {
        // Add result only if we match timeframe
        if (candle.time % new_frame == 0) {
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

  trade_to_candle: (tradedata, intverval = 60) => {
    intverval *= 1000;

    let result = [];

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

  tick_chart: (tradedata, tick_lenght = 5) => {
    let result = [];

    tick_lenght = parseInt(tick_lenght);

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

module.exports = convert;
