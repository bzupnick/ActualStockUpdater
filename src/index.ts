import * as fs from "fs";

const axios = require('axios').default;
let Stocks = require('stocks.js')
let api = require('@actual-app/api');
let yaml = require('js-yaml');

const config = yaml.load(fs.readFileSync('./configs/investments.yaml', 'utf8'));
const stocks = new Stocks(config.alphaAdvantageApiKey);

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


async function getCurrentWorthOfIndexFunds() {
    let totalWorthOfIndexFunds = 0;
    for (const ticker of config.investments.stocks.tickers) {
        let tickerName = Object.keys(ticker)[0];
        let tickerAmountOwned = ticker[tickerName];

        let result = await stocks.timeSeries({
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

async function getCurrentWorthOfCrypto() {
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
//
// function post_transaction_to_update_account(needed_transaction, account_id, payee_name) {
//     var endpoint = "/budgets/" + BUDGET_ID + "/transactions";
//     var payload = {
//         "transaction": {
//             "account_id": account_id,
//             "amount": needed_transaction,
//             "date": Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd'),
//             "payee_name": payee_name,
//             "memo": (new Date().getHours() >= 12) ? "Market Close" : "Market Open",
//             "cleared": "cleared",
//             "approved": true
//         }
//     };
//     var res = call_ynab_api("post", endpoint, payload)
//     return res;
// }
//
// function reconcile_index_funds() {
//     var current_ynab_index_fund = get_current_index_fund_balance();
//     var updated_index_fund_assets_from_google_sheet = get_updated_index_fund_assets_from_google_sheet()
//
//     var index_fund_difference = updated_index_fund_assets_from_google_sheet - current_ynab_index_fund
//     if(index_fund_difference > 1 || index_fund_difference < -1) {
//         post_transaction_to_update_account(Math.round(index_fund_difference), INDEX_FUND_ACCOUNT_ID, "Stock Market");
//     }
// }
//
// function reconcile_crypto() {
//     var current_ynab_coinbase = get_current_coinbase_balance();
//     var updated_crypto_assets_from_google_sheet = get_updated_crypto_assets_from_google_sheet()
//
//     var crypto_difference = updated_crypto_assets_from_google_sheet - current_ynab_coinbase
//     if(crypto_difference > 1 || crypto_difference < -1) {
//         post_transaction_to_update_account(Math.round(crypto_difference), COINBASE_ACCOUNT_ID, "Crypto Gods");
//     }
// }
