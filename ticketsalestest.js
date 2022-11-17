const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const {abi, bytecode} = require('../compile');


let accounts;
let ticketSale;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  //console.log(accounts);
  //balance = web3.eth.getBalance(accounts[0]);
  //console.log(balance);
  ticketSale = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: [100000,1],
    })
    .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000});
});


describe("ticketSale", () => {
  it("deploys a contract with owner", () => {
    //console.log(ecomm);
    assert.ok(ticketSale.options.address);
  });

  it("verify buyticketOf and getticketOf", async () => {
    ticketSale.methods.buyTicket(5).send({from :accounts[1], value: 1, gasPrice: 8000000000, gas: 4700000});
    const ticketId = await ticketSale.methods.getTicketOf(accounts[1]).call();
    assert.equal(ticketId, 5);
    
  });
  it("verify soldTicket", async () => {
    ticketSale.methods.buyTicket(6).send({from :accounts[1], value: 1, gasPrice: 8000000000, gas: 4700000});
    const isSold = await ticketSale.methods.isSold(6).call();
    assert.equal(isSold, true);
  });
  it("verify offerswap and acceptswap", async () => {
    ticketSale.methods.buyTicket(1).send({from :accounts[1], value: 1, gasPrice: 8000000000, gas: 4700000});
    ticketSale.methods.buyTicket(2).send({from :accounts[2], value: 1, gasPrice: 8000000000, gas: 4700000});
    ticketSale.methods.offerSwap(accounts[2]).send({from :accounts[1], gasPrice: 8000000000, gas: 4700000});
    ticketSale.methods.acceptSwap(accounts[1]).send({from :accounts[2], gasPrice: 8000000000, gas: 4700000});
    const ticketId1 = await ticketSale.methods.getTicketOf(accounts[1]).call();
    const ticketId2 = await ticketSale.methods.getTicketOf(accounts[2]).call();
    assert.equal(ticketId1, 2);
    assert.equal(ticketId2, 1);
  });
  
  


 
  
  /*it("verify addProduct", async () => {
    ecomm.methods.addProduct("iphone",10,800).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000});
    const product = await ecomm.methods.productList(0).call();
    //assert.equal(product., "Shahid");
    //console.log(product);
    assert.equal(product.productNo, 0);
  });*/
});
