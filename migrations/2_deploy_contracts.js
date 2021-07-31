const LowbMaticWallet = artifacts.require("LowbMaticWallet");

module.exports = function(deployer) {
  //const lowbAddress = '0x1c0a798b5a5273a9e54028eb1524fd337b24145f'; // matic mainnet
  const lowbAddress = '0x5cD4d2f947ae4568A8bd0905dbF12D3454D197F3'; // matic testnet
  deployer.deploy(LowbMaticWallet, lowbAddress);
};
