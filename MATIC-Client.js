const Web3 = require('web3')
const fs = require('fs')
const PRIVATE_KEY_FILE_NAME = process.env.PRIVATE_KEY_FILE || '.private_key'
const SLEEP_INTERVAL = process.env.SLEEP_INTERVAL || 5000
const PROJECT_ID = fs.readFileSync(".rpc_id").toString(); // from https://rpc.maticvigil.com/
const WalletJSON = require('./build/contracts/LowbMaticWallet.json')
const lowxJSON = require('./build/contracts/MyCollectible.json')


async function init () {
  const privateKeyStr = fs.readFileSync(PRIVATE_KEY_FILE_NAME, 'utf-8')
  let bscWeb3 = new Web3('https://data-seed-prebsc-1-s2.binance.org:8545')
  let maticWeb3 = new Web3(`https://matic-mumbai.chainstacklabs.com`)
  bscWeb3.eth.accounts.wallet.add(privateKeyStr)
  //maticWeb3.eth.accounts.wallet.add(privateKeyStr)
  const ownerAddress = bscWeb3.eth.accounts.wallet[0].address
  const lowxContract = new bscWeb3.eth.Contract(lowxJSON.abi, '0xe031188b0895AFD3f3c32b2BF27FbD1Ab9E8c9eA')
  const maticWalletContract = new maticWeb3.eth.Contract(WalletJSON.abi, '0x6d9c2dbB7c09f68B2fCD04a8DEE4a8906B177A13')
  return { ownerAddress, bscWeb3, maticWeb3, lowxContract, maticWalletContract }
}

(async () => {
  const { ownerAddress, bscWeb3, maticWeb3, lowxContract, maticWalletContract } = await init()
  process.on( 'SIGINT', () => {
    console.log('Calling client.disconnect()')
    process.exit( );
  })

  let prevBlock = await maticWeb3.eth.getBlockNumber()
  console.log('start listening from ...', prevBlock)
  setInterval( async () => {
    let block = await maticWeb3.eth.getBlockNumber()
    let transactions = await maticWalletContract.getPastEvents('NFTLocked', { filter: {contractAddress: '0xcf57667f3c107cd97105b9cd97c81c21ab8ba0c5'}, fromBlock: prevBlock, toBlock: block })
    console.log(prevBlock, block);
	prevBlock = block + 1;
	for (let i=0; i<transactions.length; i++) {
      let value = transactions[i].returnValues
      console.log('* New Transfer event. id: ', value.tokenId)
      await lowxContract.methods.transferFrom(ownerAddress, value.user, value.tokenId).send({ from: ownerAddress, gas: 150000, gasPrice: 10000000000})
	  console.log('* Success. id: ', value.tokenId)
    }
	
  }, SLEEP_INTERVAL);
})()
