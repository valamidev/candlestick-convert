
import fetch from 'node-fetch';
import * as fs from 'fs';

// https://api.binance.com/api/v3/trades?symbol=BTCUSDT
// https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=500

// Generate fixtures

const symbol = `BTCUSDT`;


fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=1000`)
    .then(res => res.json())
    .then(json => { fs.writeFileSync('./trades.json', JSON.stringify(json)); 
});

fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=500`)
    .then(res => res.json())
    .then(json => { fs.writeFileSync('./candlestick1m.json', JSON.stringify(json)); 
});

fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=120`)
    .then(res => res.json())
    .then(json => { fs.writeFileSync('./candlestick5m.json', JSON.stringify(json)); 
});

fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=50`)
    .then(res => res.json())
    .then(json => { fs.writeFileSync('./candlestick15m.json', JSON.stringify(json)); 
});

fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=10`)
    .then(res => res.json())
    .then(json => { fs.writeFileSync('./candlestick1h.json', JSON.stringify(json)); 
});