import { getAccountBalance, api } from './actual'
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

    for (const investmentType of investmentTypes) {
        if (config.investments[investmentType]) {
            currentBalances.set(investmentType, await getAccountBalance(config.investments[investmentType].actualAccount))
        }
    }

    for (const investmentType of investmentTypes) {
        if (config.investments[investmentType]) {
            console.log(await calculateInvestmentTypeWorth.get(investmentType)?.getCurrentWorth());
        }
    }
}