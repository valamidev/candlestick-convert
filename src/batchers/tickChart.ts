import { Trade, IOHLCV } from "../interfaces";

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
