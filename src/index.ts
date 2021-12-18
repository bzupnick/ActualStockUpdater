import * as fs from "fs";

let api = require('@actual-app/api');
let yaml = require('js-yaml');

const config = yaml.load(fs.readFileSync('./configs/investments.yaml', 'utf8'));

api.runWithBudget(config.actualBudgetId, main);

async function main () {
    const accounts = await api.getAccounts();
    console.log(accounts);
}
