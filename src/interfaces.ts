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
