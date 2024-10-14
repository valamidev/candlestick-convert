export type IOHLCV = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type ExtIOHLCV = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  buyVolume: number;
  tx: number;
  buyTx: number;
};

export type OHLCV = [number, number, number, number, number, number];

export const TradeSide = {
  BUY: 0,
  SELL: 1,
};

export type TradeTick = {
  price: number;
  quantity: number;
  time: number;
};

export type Trade = {
  price: number;
  quantity: number;
  time: number;
  side: number;
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
