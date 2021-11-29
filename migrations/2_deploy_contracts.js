var VotingContract = artifacts.require("./Voting.sol");


module.exports = function(deployer) {
  deployer.deploy(VotingContract);
};
