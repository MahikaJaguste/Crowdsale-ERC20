const truffleAssert = require('truffle-assertions');
const assert = require("chai").assert;

const MyToken = artifacts.require("MyToken");

const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const PAUSER_ROLE = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a"; 

contract("Testing MyToken contract", async (accounts) => {

    let myTokenInstance;
    const owner = accounts[0];
    const regular = accounts[1];

    before(async () => {
        myTokenInstance = await MyToken.new("MahikaToken", "MT", {from: owner});
        // const myTokenInstance = await MyToken.deployed();  
    });

    after(async () => {
        const owner_balance = await myTokenInstance.balanceOf.call(owner);
        const regular_balance = await myTokenInstance.balanceOf.call(regular);
        assert(0 == regular_balance, "Balance of regular is non-zero");
        await myTokenInstance.burn(owner_balance, {from: owner});
        // await myTokenInstance.burn(regular_balance, {from: regular});
    });

    it("should deploy correctly", async () => {
        // console.log(myTokenInstance.address);
        assert.ok(myTokenInstance);
    });

    it("checking roles of deployer", async () => {
        assert(await myTokenInstance.hasRole.call(DEFAULT_ADMIN_ROLE , owner), "Deployer does not have default admin role");
        assert(await myTokenInstance.hasRole.call(MINTER_ROLE, owner), "Deployer does not have miner role");
        assert(await myTokenInstance.hasRole.call(PAUSER_ROLE, owner), "Deployer does not have pauser role");
        assert(!(await myTokenInstance.hasRole.call(DEFAULT_ADMIN_ROLE , regular)), "Regular has default admin role");
        assert(!(await myTokenInstance.hasRole.call(MINTER_ROLE, regular)), "Regular has miner role");
        assert(!(await myTokenInstance.hasRole.call(PAUSER_ROLE, regular)), "Regular has pauser role");
    });

    it("granting and revoking minter role", async () => {

        await myTokenInstance.mint(owner, 1, {from: owner});
        assert.equal(1, await myTokenInstance.balanceOf.call(owner), "Token not mined by owner");
        
        await truffleAssert.reverts(myTokenInstance.mint(regular, 1, {from: regular}));
        await truffleAssert.reverts(myTokenInstance.grantRole(MINTER_ROLE, regular, {from: regular}));

        await myTokenInstance.grantRole(MINTER_ROLE, regular, {from: owner});
        assert(await myTokenInstance.hasRole.call(MINTER_ROLE, regular), "Minter role not granted to regular");
        await myTokenInstance.mint(regular, 1, {from: regular});
        assert.equal(1, await myTokenInstance.balanceOf.call(regular), "Regular with minter role cannot mine");
    
        await myTokenInstance.revokeRole(MINTER_ROLE, regular, {from: owner});
        assert(!(await myTokenInstance.hasRole.call(MINTER_ROLE, regular)), "Minter role not revoked from regular"); 
    });

    it("should transfer token correctly", async () => {
        await myTokenInstance.transfer(owner, 1, {from: regular});
        assert.equal(2, await myTokenInstance.balanceOf.call(owner), "Receipient balance not increased");
        assert.equal(0, await myTokenInstance.balanceOf.call(regular), "Sender balance not decreased");
    });
});