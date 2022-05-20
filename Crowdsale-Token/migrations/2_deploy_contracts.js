const MyToken = artifacts.require("MyToken");
const Crowdsale = artifacts.require("Crowdsale");

module.exports = function (deployer) {
  deployer.deploy(MyToken, "My Token", "MT");
  deployer.deploy(Crowdsale);
};
