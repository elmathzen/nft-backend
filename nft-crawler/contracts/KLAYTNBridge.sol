// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./KIP7.sol";
import "./TransferHelper.sol";

contract KLAYTNBridge is Ownable {
    using SafeMath for uint256;

    address public signer;
    uint256 public defaultTransitFee;

    mapping(address => uint256) public transitFee;
    mapping(string => bool) public executed;
    mapping(address => address) public ercToKip;
    mapping(address => address) public kipToErc;

    event Transit(
        address indexed ercToken,
        address indexed to,
        uint256 indexed amount,
        string transitId
    );
    event Payback(address indexed ercToken, address indexed to, uint256 amount);
    event CreateToken(
        address indexed kipToken,
        string indexed name,
        string indexed symbol
    );

    constructor(address _signer, uint256 _defaultTransitFee) public {
        signer = _signer;
        defaultTransitFee = _defaultTransitFee;
    }

    function changeTransitFee(address ercToken, uint256 _transitFee)
    external
    onlyOwner
    {
        transitFee[ercToken] = _transitFee;
    }

    function changeSigner(address _signer) external onlyOwner {
        signer = _signer;
    }

    function withdrawFee(address _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "invalid address");
        require(_amount > 0, "amount must be greater than 0");
        TransferHelper.safeTransferETH(_to, _amount);
    }

    function transit(
        address _ercToken,
        string memory _name,
        string memory _symbol,
        uint256 _amount,
        string memory _transitId,
        uint8 v, bytes32 r, bytes32 s
        // bytes calldata _signature    // Klaytn can not receive this argument
    ) external payable {
        require(!executed[_transitId], "already transit");
        require(_amount > 0, "amount must be greater than 0");

        // Change for Klaytn Mainnet = 8217
        uint256 chainId = 1001;
        // Comment Out : This code make error on Klaytn
        // assembly {
        //     chainId := chainid()
        // }
        bytes32 message =
        keccak256(
            abi.encodePacked(
                chainId,
                address(this),
                _ercToken,
                _amount,
                msg.sender,
                _transitId
            )
        );
        bytes32 signature =
        keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", message)
        );

        require(
            // ECDSA.recover(signature, _signature) == signer,  // Arguments changed
            ecrecover(signature, v, r, s) == signer,
            "invalid signature"
        );

        if (ercToKip[_ercToken] == address(0)) {
            transitFee[_ercToken] = defaultTransitFee;

            bytes memory bytecode =
            abi.encodePacked(
                type(TaalKIP7).creationCode,
                abi.encode(_name, _symbol)
            );
            bytes32 salt =
            keccak256(abi.encodePacked(_ercToken, _name, _symbol));
            address newToken;
            assembly {
                newToken := create2(0, add(bytecode, 32), mload(bytecode), salt)
            }
            ercToKip[_ercToken] = newToken;
            kipToErc[newToken] = _ercToken;

            emit CreateToken(newToken, _name, _symbol);
        }
        require(transitFee[_ercToken] == msg.value, "invalid transit fee");

        TaalKIP7(ercToKip[_ercToken]).mint(msg.sender, _amount);
        executed[_transitId] = true;
        emit Transit(_ercToken, msg.sender, _amount, _transitId);
    }

    function payback(address _kipToken, uint256 _amount) external payable {
        address ercToken = kipToErc[_kipToken];

        require(ercToken != address(0), "invalid token");
        require(_amount > 0, "amount must be greater than 0");
        require(transitFee[ercToken] == msg.value, "invalid transit fee");

        TaalKIP7(_kipToken).burn(msg.sender, _amount);
        emit Payback(ercToken, msg.sender, _amount);
    }

    function transferTokenOwnership(address _kipToken, address _to)
    external
    onlyOwner
    {
        address ercToken = kipToErc[_kipToken];
        require(kipToErc[_kipToken] != address(0), "invalid token");

        TaalKIP7(_kipToken).transferOwnership(_to);
        ercToKip[ercToken] = address(0);
        kipToErc[_kipToken] = address(0);
        transitFee[ercToken] = 0;
    }
}
