import * as fs from "fs";
let yaml = require('js-yaml');

export const config = yaml.load(fs.readFileSync('./configs/investments.yaml', 'utf8'));
