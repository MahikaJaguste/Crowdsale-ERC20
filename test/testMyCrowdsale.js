const truffleAssert = require('truffle-assertions');
const assert = require("chai").assert;
const {getUnix} = require('../helper_scripts/getUnixTimestamp');
const  {getDateTime} = require('../helper_scripts/getCurrentDateTime');

const TimeContract = artifacts.require("TimeContract");
const MyToken = artifacts.require("MyToken");
const MyCrowdsale = artifacts.require("MyCrowdsale");

const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const PAUSER_ROLE = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a"; 
const DECIMALS = 10**18;
const INVERSE_DECIMALS = 10**(-18);

contract("Testing MyToken contract", async (accounts) => {

    let myTokenInstance;
    let myCrowdsaleInstance;
    const owner = accounts[0];
    const regular = accounts[1];
    const walletAddr = accounts[2];

    before(async () => {
        myTokenInstance = await MyToken.new("MahikaToken", "MT", {from: owner});
        
        var d = new Date();
        d.setSeconds(d.getSeconds() + 1);
        const openingTime = getUnix(getDateTime(d));

        d.setMinutes(d.getMinutes() + 10);
        const closingTime = getUnix(getDateTime(d));

        myCrowdsaleInstance = await MyCrowdsale.new(1, walletAddr, myTokenInstance.address, 10, openingTime, closingTime, {from: owner});

        await myTokenInstance.grantRole(MINTER_ROLE, myCrowdsaleInstance.address, {from:owner});

    });

    after(async () => {
        const owner_balance = await myTokenInstance.balanceOf.call(owner);
        const regular_balance = await myTokenInstance.balanceOf.call(regular);
        await myTokenInstance.burn(owner_balance, {from: owner});
        await myTokenInstance.burn(regular_balance, {from: regular});
    });

    it("should deploy correctly", async () => {
        assert.ok(myTokenInstance);
        assert.ok(myCrowdsaleInstance);
    });

    it("checking roles", async () => {
        assert(await myCrowdsaleInstance.hasRole.call(PAUSER_ROLE, owner), "Deployer does not have pauser role");
        assert(!(await myCrowdsaleInstance.hasRole.call(PAUSER_ROLE, regular)), "Regular has pauser role");
        assert(await myTokenInstance.hasRole.call(MINTER_ROLE, myCrowdsaleInstance.address), "Crowdsale contract does not have miner role in TokenContract");
    });

    it("buy tokens should work correctly", async () => {

        const old_balance = BigInt(await web3.eth.getBalance(walletAddr));
        await myCrowdsaleInstance.buyTokens(regular, {from: regular, value:'10'});
        const new_balance = BigInt(await web3.eth.getBalance(walletAddr));

        assert.equal(10, await myTokenInstance.balanceOf.call(regular), "Receipient balance not increased");
        assert.equal(10, new_balance - old_balance, "Wallet balance not increased");
    });

    it("should not sell more than cap", async () => {
        await truffleAssert.reverts(myCrowdsaleInstance.buyTokens(regular, {from: regular, value:'11'}));
    });

    it("should not sell tokens when paused", async () => {
    });

    it("should not sell tokens before opening", async () => {
    });

    it("should not sell tokens after closing", async () => {
    });
});