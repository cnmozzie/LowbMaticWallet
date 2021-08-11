const N = 2
const LowbMaticWallet = artifacts.require('LowbMaticWallet');

module.exports = async function(callback) {
  try {
  
    const nft = await LowbMaticWallet.at('0x6d9c2dbB7c09f68B2fCD04a8DEE4a8906B177A13')
    
    for (let i=2; i<4; i++) {
      console.log("transfer: ", i)
      await nft.unlockNFT('0xcf57667f3c107cd97105b9cd97c81c21ab8ba0c5', i, '0x568903F6A2CE809ac14E189cF31dD27992A1E4Bc')
    }
    
  }
  catch(error) {
    console.log(error)
  }

  callback()
}