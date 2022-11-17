const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'secret phrase',
  // remember to change this to your own phrase!
  'https://goerli.infura.io/v3/d2da6ac7482d4b29aa8067a289977191'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

async function scan(message) {
    process.stdout.write(message);
    return await new Promise(function(resolve, reject) {
        process.stdin.resume();
        process.stdin.once("data", function(data) {
            process.stdin.pause();
            resolve(data.toString().trim());
        });
    });
}

async function getGasPrice() {
    while (true) {
        const nodeGasPrice = await web3.eth.getGasPrice();
        const userGasPrice = await scan('Enter gas-price or leave empty to use ${nodeGasPrice}: ');
        if (/^\d+$/.test(userGasPrice))
            return userGasPrice;
        if (userGasPrice == "")
            return nodeGasPrice;
        console.log("Illegal gas-price");
    }
}


const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
  console.log(web3.eth.getGasPrice())

  lott = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode, arguments: ['100000', '1']
    })
    .send({ from: accounts[0], gasPrice: await getGasPrice(), gas: 1500000});

  console.log('Contract deployed to', lott.options.address);
  provider.engine.stop();
};
deploy();
