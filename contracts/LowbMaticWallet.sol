// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC721LOWB.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LowbMaticWallet {
  
  
  
  address public lowbTokenAddress;
  address public owner;
  uint public fee;
  
  mapping (address => uint) public balanceOf;
  mapping (address => bool) public isAwardAddress;
  
  event Deposit(address indexed user, uint amount);
  event Withdraw(address indexed user, uint amount);
  event Award(address indexed contractAddress, address indexed user, uint amount);
  event Use(address indexed contractAddress, address indexed user, uint amount);
  event NFTLocked(address indexed contractAddress, uint indexed tokenId, address indexed user);
  event NFTUnlocked(address indexed contractAddress, uint indexed tokenId, address indexed user);
  
  constructor(address lowbToken_) {
    lowbTokenAddress = lowbToken_;
    owner = msg.sender;
  }
  
  function deposit(uint amount) public {
    require(amount > 0, "You deposit nothing!");
    IERC20 token = IERC20(lowbTokenAddress);
    require(token.transferFrom(msg.sender, address(this), amount), "Lowb transfer failed");
    balanceOf[msg.sender] +=  amount;
    
    emit Deposit(msg.sender, amount);
  }

  function withdraw(uint amount) public {
    require(amount <= balanceOf[msg.sender], "amount larger than the balance");  
    balanceOf[msg.sender] -= amount;
    IERC20 token = IERC20(lowbTokenAddress);
    require(token.transfer(msg.sender, amount), "Lowb transfer failed");
    
    emit Withdraw(msg.sender, amount);
  }
  
  function approveAward(address addr, bool b) public {
    require(msg.sender == owner, "You are not admin");
    isAwardAddress[addr] = b;
  }
  
  function setFee(uint fee_) public {
    require(msg.sender == owner, "You are not admin");
    fee = fee_;
  }
  
  function use(address user, uint amount) public {
    require(isAwardAddress[msg.sender], "you are not approved to use this user's lowb");  
    require(amount <= balanceOf[user], "amount larger than the balance");  
    balanceOf[user] -= amount;
    
    emit Use(msg.sender, user, amount);
  }
  
  function award(address user, uint amount) public {
    require(isAwardAddress[msg.sender], "you are not approved to award lowb to others");  
    balanceOf[user] += amount;
    
    emit Award(msg.sender, user, amount);
  }
  
  function lockNFT(address nftAddress, uint tokenId) public {
    IERC721LOWB nft = IERC721LOWB(nftAddress);
    require(nft.ownerOf(tokenId) == msg.sender && nft.holderOf(tokenId) == msg.sender, "You don't have access to lock this nft.");
    
    require(fee <= balanceOf[msg.sender], "fee larger than the balance");
    balanceOf[msg.sender] -= fee;
    
    nft.transferFrom(msg.sender, address(this), tokenId);
    
    emit NFTLocked(nftAddress, tokenId, msg.sender);
  }
  
  function unlockNFT(address nftAddress, uint tokenId, address user) public {
    require(msg.sender == owner, "You are not admin");
  
    IERC721LOWB nft = IERC721LOWB(nftAddress);
    require(nft.ownerOf(tokenId) == address(this), "this nft is not loced in the contract");
    
    nft.transferFrom(address(this), user, tokenId);
    
    emit NFTUnlocked(nftAddress, tokenId, user);
  }
  
  
}
