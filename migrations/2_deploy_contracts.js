const {getUnix} = require('../helper_scripts/getUnixTimestamp');

const MyToken = artifacts.require("MyToken");
const MyCrowdsale = artifacts.require("MyCrowdsale");

module.exports = async function(deployer, network, accounts) {

  if(network != 'test') {
    await deployer.deploy(MyToken, "MahikaToken", "MT", {from: accounts[0]});
    const myTokenInstance = await MyToken.deployed();
    // console.log(myTokenInstance.address);

    const openingTime = getUnix('05/24/2022 18:22:00');
    const closingTime = getUnix('05/25/2022 20:00:00');

    await deployer.deploy(MyCrowdsale, 
                    1, 
                    "0x9b5C1dD1D6dE9c95664aB5eD088e18A63e86edFB",
                    myTokenInstance.address,
                    10,
                    openingTime,
                    closingTime,
                    {from: accounts[0]},
                    );
    const myCrowdsaleInstance = await MyCrowdsale.deployed();
    // console.log(myCrowdsaleInstance.address);
  }
  
};