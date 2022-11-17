const path = require('path');
const fs = require('fs');
const solc = require('solc');
//const solc = require('solc@0.4.17');

const ticketSalePath = path.resolve(__dirname, 'contracts', 'ticketSale.sol');
const source = fs.readFileSync(ticketSalePath, 'utf8');


let input = {
  language: "Solidity",
  sources: {
    "ticketSale.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output)
const contracts = output.contracts["ticketSale.sol"];

console.log(contracts.ticketSale);

for (let contractName in contracts) {
  const contract = contracts[contractName];
  module.exports= {"abi":contract.abi,"bytecode":contract.evm.bytecode.object};
}
