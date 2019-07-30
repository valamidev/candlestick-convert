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
  }
};

module.exports = convert;
