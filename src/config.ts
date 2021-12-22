import * as fs from "fs";
let yaml = require('js-yaml');


module.exports = {
    config: yaml.load(fs.readFileSync('./configs/investments.yaml', 'utf8'))
};