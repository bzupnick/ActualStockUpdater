let Actual = require('./actual');
let MyStocks = require('./stocks');
let MyCrypto = require('./crypto');
import { config } from './config'

const investmentTypes = Object.keys(config.investments);

Actual.api.runWithBudget(config.actualBudgetId, main);

async function main () {
    let curIndexFundBalance: number|null = null;
    let curCryptoBalance: number|null = null;
    if (config.investments.stocks) {
        curIndexFundBalance = await Actual.getAccountBalance(config.investments.stocks.actualAccount);
    }
    if (config.investments.crypto) {
        curCryptoBalance = await Actual.getAccountBalance(config.investments.crypto.actualAccount);
    }

    if (curCryptoBalance) {
        console.log(await MyStocks.getCurrentWorth());
    }

    if (curIndexFundBalance) {
        console.log(await MyCrypto.getCurrentWorth());
    }
}