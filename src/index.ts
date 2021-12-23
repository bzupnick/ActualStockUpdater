import { getAccountBalance, api, addTransaction } from './actual'
import { config } from './config'
import { Stocks } from './stocks'
import { Crypto } from './crypto'

const investmentTypes = Object.keys(config.investments);
let calculateInvestmentTypeWorth = new Map([
    ['stocks', new Stocks()],
    ['crypto', new Crypto()],
]);

api.runWithBudget(config.actualBudgetId, main);

async function main () {
    let currentBalances = new Map();
    let worthOfInvestments = new Map();

    // get current balances of Actual accounts
    for (const investmentType of investmentTypes) {
        if (config.investments[investmentType]) {
            currentBalances.set(investmentType, await getAccountBalance(config.investments[investmentType].actualAccount))
        }
    }

    // get the amount your investments are actually worth
    for (const investmentType of investmentTypes) {
        if (config.investments[investmentType]) {
            worthOfInvestments.set(investmentType, await calculateInvestmentTypeWorth.get(investmentType)?.getCurrentWorth());
        }
    }

    // get the difs of the Actual balance and actual worth of the investments
    for (const investmentType of investmentTypes) {
        let dif = worthOfInvestments.get(investmentType) - currentBalances.get(investmentType);
        if (dif !== 0) {
            await addTransaction(
                config.investments[investmentType].actualAccount,
                config.investments[investmentType].payeeName,
                dif
            )
        }
    }
}