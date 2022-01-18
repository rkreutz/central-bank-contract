// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IMinimalERC20 {

    function transfer(address recipient, uint256 amount) external returns (bool);
    
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract CentralBank is Ownable, Pausable, EIP712 {

    using Counters for Counters.Counter;
    Counters.Counter private _nonce;

    bytes32 private immutable _hashedType;
    address private _signer;
    address[] private _tokens;

    constructor(address signer, address[] memory tokens, string memory name, string memory version) Ownable() Pausable() EIP712(name, version) {
        _signer = signer;
        _tokens = tokens;
        _hashedType = keccak256("Claim(address claimer,uint tokenIdx,uint256 amount,uint256 nonce)");
    }

    function getNonce() external view returns (uint256) {
        return _nonce.current();
    }

    function getTokens() external view returns (address[] memory) {
        return _tokens;
    }

    function claim(uint tokenIdx, uint256 amount, uint256 nonce, bytes calldata sig) public whenNotPaused {
        require(_nonce.current() == nonce, "Ivalid nonce");
        require(tokenIdx < _tokens.length, "Invalid token index");

        bytes32 digest = _hashTypedDataV4(_hashClaim(msg.sender, tokenIdx, amount, nonce));
        require(ECDSA.recover(digest, sig) == _signer, "Message is not from signer");

        _nonce.increment();
        IMinimalERC20 token = IMinimalERC20(_tokens[tokenIdx]);
        require(token.transfer(msg.sender, amount) == true, "Failed to withdraw funds");
    }

    function setSigner(address signer) public onlyOwner {
        require(_signer != signer);
        require(signer != address(0), "New signer is the zero address");
        _signer = signer;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpaus() public onlyOwner {
        _unpause();
    }

    function withdrawTokenBalance(address token, uint256 amount) public onlyOwner {
        IMinimalERC20 _token = IMinimalERC20(token);
        require(_token.transfer(msg.sender, amount) == true, "Failed to withdraw funds");
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function _hashClaim(address claimer, uint256 tokenIdx, uint256 amount, uint256 nonce) private view returns (bytes32) {
        return keccak256(abi.encode(_hashedType, claimer, tokenIdx, amount, nonce));
    }
}