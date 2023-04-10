// This code helps sending transaction to metamask for USDT token specifically.
// To send some other token ofcourse you will have to change the token contract address to that token's contract address.

const transactButton = document.getElementById('transact')
const accountParagraph = document.getElementById('account')

// Tether token contract address
const USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
let ethereum, accounts;

const initialize = function() {
  console.log('Initializing...')
  transactButton.style.display = 'none'

  if (!('ethereum' in window)) {
    accountParagraph.style.display = 'none'

    alert('Metamask isn\'t installed!')
  } else ethereum = window.ethereum
  

  ethereum.request({ method: 'eth_requestAccounts' }).then(res => {
    accounts = res
    console.log({ message: 'Accounts found', accounts })
    
    if (accounts.length > 0) {
      accountParagraph.innerText = `Account: ${accounts[0]}`
      transactButton.style.display = 'inline-block'

      transactButton.addEventListener('click', function() {
        ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: accounts[0],
            to: USDT_CONTRACT_ADDRESS,
            // Your ethereum account address.
            // 1000000 = 1 USDT
            data: getDataFieldValue('0x123...', 1000000)
          }]
        })
      })
    }
  });
}

initialize();

// Got this function from...
// https://stackoverflow.com/questions/70846974/how-to-send-some-custom-tokens-with-metamask-api
// Petr Hejda's answer
function getDataFieldValue(tokenRecipientAddress, tokenAmount) {
  const web3 = new Web3();
  const TRANSFER_FUNCTION_ABI = {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"};
  return web3.eth.abi.encodeFunctionCall(TRANSFER_FUNCTION_ABI, [
      tokenRecipientAddress,
      tokenAmount
  ]);
}