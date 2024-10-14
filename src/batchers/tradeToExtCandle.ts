import { ExtIOHLCV, Trade, TradeSide } from "../interfaces";

export const batchTradeToExtCandle = (
  tradeData: Trade[],
  interval: number = 60,
  includeOpenCandle = false,
  filterFn?: (trade: Trade) => boolean
): ExtIOHLCV[] => {
  interval *= Math.floor(1000);

  let result: ExtIOHLCV[] = [];

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
  let buyVolume = 0;
  let tx = 0;
  let buyTx = 0;
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
      tx = 1;
      buyVolume = 0;
      buyTx = 0;

      if (trade.side === TradeSide.BUY) {
        buyVolume = trade.quantity;
        buyTx = 1;
      }
    }

    // We are still in the CandleTime
    if (timeOpen == trade.time) {
      low = Math.min(trade.price, low);
      high = Math.max(trade.price, high);

      if (i > 0) {
        volume += trade.quantity;
        tx += 1;

        if (trade.side === TradeSide.BUY) {
          buyVolume += trade.quantity;
          buyTx += 1;
        }

        close = trade.price;
      }
    } else {
      result.push({
        time: timeOpen,
        open,
        high,
        low,
        close,
        volume,
        tx,
        buyVolume,
        buyTx,
      });
      // Create new candle
      timeOpen = trade.time;
      open = previousClose || trade.price;
      low = trade.price;
      high = trade.price;
      close = trade.price;
      volume = trade.quantity;
      tx = 0;
      buyVolume = 0;
      buyTx = 0;
    }
    previousClose = close;
  }

  if (previousClose && includeOpenCandle) {
    result.push({
      time: timeOpen,
      open,
      high,
      low,
      close,
      volume,
      tx,
      buyVolume,
      buyTx,
    });
  }

  return result;
};
