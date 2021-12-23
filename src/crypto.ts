import { config } from './config'
const axios = require('axios').default;

async function getCurrentWorth() {
    let totalWorthOfCrypto = 0;
    for (const ticker of config.investments.crypto.tickers) {
        let tickerName = Object.keys(ticker)[0];
        let tickerAmountOwned = ticker[tickerName];

        let url = `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${config.cryptoCompareApiKey}`
        const result = (await axios.get(url)).data.USD

        totalWorthOfCrypto += result * tickerAmountOwned
    }
    return totalWorthOfCrypto;
}

module.exports = {getCurrentWorth: getCurrentWorth};