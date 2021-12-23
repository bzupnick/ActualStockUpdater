export const api = require('@actual-app/api');
import { config } from './config'

let accounts: any;
const curDate = getCurDate();

export const getAccountBalance = async function (name: string) {
    accounts = await api.getAccounts();
    let accountId = accountNameToId(name);
    let totalBalance = 0;
    const allTransactions = await api.getTransactions(accountId, "1980-01-01", curDate)
    allTransactions.forEach((k:any) => totalBalance += k.amount)
    totalBalance = totalBalance / 100;
    return totalBalance;
};

export const addTransaction = async function (accountName: string, payee: string, amount: number) {
    let accountId = accountNameToId(accountName);
    amount = Math.floor(amount*100); // this converts 1.23 to 123 and 1.2345678 to 123
    await api.addTransactions(accountId,[{
        account: accountId,
        date: curDate,
        amount: amount,
        payee: await payeeNameToId(payee)
    }])
}

function accountNameToId(name: string) {
    return accounts.find((account:any) => account.name === name ).id
}

async function payeeNameToId(name: string) {
    let payees = await api.getPayees();
    return payees.find((payee:any) => payee.name === name ).id
}

function getCurDate() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    return `${year}-${month}-${date}`;
}