const LowbMaticWallet = artifacts.require("LowbMaticWallet");

module.exports = function(deployer) {
  //const lowbAddress = '0x1c0a798b5a5273a9e54028eb1524fd337b24145f'; // matic mainnet
  //const lowbAddress = '0x5cD4d2f947ae4568A8bd0905dbF12D3454D197F3'; // matic testnet
  //const lowbAddress = '0x843d4a358471547f51534e3e51fae91cb4dc3f28'; // bsc mainnet
  const lowbAddress = '0x5aa1a18432aa60bad7f3057d71d3774f56cd34b8'; // bsc testnet
  deployer.deploy(LowbMaticWallet, lowbAddress);
};
