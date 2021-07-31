# LowbMaticWallet
Manage Lowb and Loser NFT on matic network


### install some package

`npm install @openzeppelin/contracts`

`npm install @truffle/hdwallet-provider`

`npm install truffle-plugin-verify`

### Depolying to the live network

- Compile the smart contracts: `truffle compile`.
- Change the token address in `2_deploy_contracts.js` before deploying to live work.
- Create a new .secret file in root directory and enter your 12 word mnemonic seed phrase. Then just run `truffle migrate --network matic`. You will deploy contracts to the Binance testnet.
- To verify the contract, create a new .apikey file in root directory and enter the [API Key](https://polygonscan.com/myapikey). Then just run `truffle run verify LowbMaticWallet --network testnet`. 
