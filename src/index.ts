import * as fs from "fs";

const axios = require('axios').default;
let api = require('@actual-app/api');
let yaml = require('js-yaml');

const config = yaml.load(fs.readFileSync('./configs/investments.yaml', 'utf8'));

api.runWithBudget(config.actualBudgetId, main);
let accounts: any = null;

async function main () {
    accounts = await api.getAccounts();
    let curIndexFundBalance: number|null = null;
    let curCryptoBalance: number|null = null;
    if (config.investments.stocks) {
        curIndexFundBalance = await getAccountBalance(config.investments.stocks.actualAccount);
    }
    if (config.investments.crypto) {
        curCryptoBalance = await getAccountBalance(config.investments.crypto.actualAccount);
    }

    if (curCryptoBalance) {
        console.log(await getCurrentWorthOfCrypto());
    }

    if (curIndexFundBalance) {
        console.log(await getCurrentWorthOfIndexFunds());
    }
}

let getAccountBalance = async function (name: string) {
    let totalBalance = 0;
    const accountId = accounts.find((account:any) => account.name === name ).id
    const allTransactions = await api.getTransactions(accountId, "1980-01-01", "2021-12-20")
    allTransactions.forEach((k:any) => totalBalance += k.amount)
    totalBalance = totalBalance / 100;
    return totalBalance;
};


function getCurrentWorthOfIndexFunds() {

}

async function getCurrentWorthOfCrypto() {
    let totalWorthOfCrypto = 0;
    for (const ticker of config.investments.crypto.tickers) {
        let tickerName = Object.keys(ticker)[0];
        let tickerAmountOwned = ticker[tickerName];
        let url = `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${config.cryptoCompareApiKey}`
        const cryptoCompareRes = (await axios.get(url)).data.USD
        totalWorthOfCrypto += cryptoCompareRes * tickerAmountOwned
    }
    return totalWorthOfCrypto;
}
