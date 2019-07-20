"use strict";

function convert(candledata, base_frame = 60, new_frame = 300) {
  base_frame *= 1000;
  new_frame *= 1000;

  let convert_ratio = parseInt(new_frame / base_frame);
  let frame_lenght = convert_ratio - 1;

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

  // Candledata [time,open,high,low,close,volume]
  //          0    1    2   3    4     5
  for (let i = 0; i < candledata.length; i++) {
    const candle = candledata[i];

    // Add volume every step
    volume += candle[5];
    // Close is always close
    close = candle[4];
    // Set low at init or at a new frame
    if (low == 0) {
      low = candle[3];
    }

    // Calculate high
    high = Math.max(candle[2], high);
    // Calculate low
    low = Math.min(candle[3], low);

    // When time is match with Timeframe
    if (candle[0] % new_frame == 0) {
      // Skip fragmented start
      if (i >= convert_ratio) {
        open = candledata[i - frame_lenght][1];
      } else {
        open = candledata[0][1];
      }

      // Add result
      result.push([candle[0], open, high, low, close, volume]);

      // Reset buffers
      open = high = close = low = volume = 0;
    }
  }

  return result;
}

module.exports = convert;
