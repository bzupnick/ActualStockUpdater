import * as fs from "fs";

let api = require('@actual-app/api');
let yaml = require('js-yaml');

const config = yaml.load(fs.readFileSync('./configs/investments.yaml', 'utf8'));
api.runWithBudget(config.actualBudgetId, main);
let accounts: any = null;

async function main () {
    accounts = await api.getAccounts();
    let curIndexFundBalance: number = null;
    let curCryptoBalance: number = null;
    if (config.investments.stocks) {
        curIndexFundBalance = await getAccountBalance(config.investments.stocks.actualAccount);
    }
    if (config.investments.crypto) {
        curCryptoBalance = await getAccountBalance(config.investments.crypto.actualAccount);
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

