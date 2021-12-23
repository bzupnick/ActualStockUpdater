let Stocks = require('stocks.js')
import { config } from './config'

const stocks = new Stocks(config.alphaAdvantageApiKey);

async function getCurrentWorth() {
    let totalWorthOfIndexFunds = 500;
    // for (const ticker of config.investments.stocks.tickers) {
    //     let tickerName = Object.keys(ticker)[0];
    //     let tickerAmountOwned = ticker[tickerName];
    //
    //     let result = await stocks.timeSeries({
    //         symbol: tickerName,
    //         interval: '1min',
    //         amount: 1
    //     });
    //
    //     if (result.length == 0) {
    //         // do something because the API failed
    //         console.log("API FAILED")
    //     } else {
    //         totalWorthOfIndexFunds += result[0].open * tickerAmountOwned
    //     }
    // }
    return totalWorthOfIndexFunds;
}

module.exports = {getCurrentWorth: getCurrentWorth};