let StocksJS = require('stocks.js')
import { InvestmentType } from "./interfaces";
import { config } from './config'

const stocksJS = new StocksJS(config.alphaAdvantageApiKey);

export class Stocks implements InvestmentType {
    async getCurrentWorth() {
        let totalWorthOfIndexFunds = 0;
        for (const ticker of config.investments.stocks.tickers) {
            let tickerName = Object.keys(ticker)[0];
            let tickerAmountOwned = ticker[tickerName];

            let result = await stocksJS.timeSeries({
                symbol: tickerName,
                interval: '1min',
                amount: 1
            });

            if (result.length == 0) {
                // do something because the API failed
                console.log("API FAILED")
            } else {
                totalWorthOfIndexFunds += result[0].open * tickerAmountOwned
            }
        }
        return totalWorthOfIndexFunds;
    }
}