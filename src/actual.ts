let api = require('@actual-app/api');

let getAccountBalance = async function (name: string) {
    const accounts = await api.getAccounts();

    let totalBalance = 0;
    const accountId = accounts.find((account:any) => account.name === name ).id
    const allTransactions = await api.getTransactions(accountId, "1980-01-01", "2021-12-20")
    allTransactions.forEach((k:any) => totalBalance += k.amount)
    totalBalance = totalBalance / 100;
    return totalBalance;
};

module.exports = {
    getAccountBalance: getAccountBalance,
    api: api
};