// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interfaces/ITaalRouter02.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TransferHelper.sol";

contract ETHXswapBridge is Ownable {
    using SafeMath for uint256;
    address public signer;
    address public router;
    address public taal;
    mapping(string => bool) public executed;

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'ETHXswapBridge: EXPIRED');
        _;
    }

    event Transit(
        address indexed ercToken,
        address indexed to,
        uint256 indexed amount
    );
    event Withdraw(
        address indexed ercToken,
        address indexed to,
        uint256 indexed amount,
        string withdrawId
    );

    event SwapExactTokensForTokens(address indexed to, uint256 indexed amount, address[] indexed pathx);
    event SwapTokensForExactTokens(address indexed to, uint256 indexed amount, address[] indexed pathx);
    event SwapExactETHForTokens(address indexed to, uint256 indexed amount, address[] indexed pathx);
    event SwapTokensForExactETH(address indexed to, uint256 indexed amount, address[] indexed pathx);
    event SwapExactTokensForETH(address indexed to, uint256 indexed amount, address[] indexed pathx);
    event SwapETHForExactTokens(address indexed to, uint256 indexed amount, address[] indexed pathx);
    event SwapExactTokensForTokensSupportingFeeOnTransferTokens(address indexed to, address[] indexed pathx);
    event SwapExactETHForTokensSupportingFeeOnTransferTokens(address indexed to, address[] indexed pathx);
    event SwapExactTokensForETHSupportingFeeOnTransferTokens(address indexed to, address[] indexed pathx);


    constructor(address _signer, address _router, address _taal) public {
        signer = _signer;
        router = _router;
        taal = _taal;
    }

    function transit(address _ercToken, uint256 _amount) external {
        require(_amount > 0, "amount must be greater than 0");
        TransferHelper.safeTransferFrom(
            _ercToken,
            msg.sender,
            address(this),
            _amount
        );
        emit Transit(_ercToken, msg.sender, _amount);
    }

    function withdraw(
        bytes calldata _signature,
        string memory _withdrawId,
        address _ercToken,
        uint256 _amount
    ) external {
        require(!executed[_withdrawId], "already withdraw");
        require(_amount > 0, "amount must be greater than 0");

        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        bytes32 message =
        keccak256(
            abi.encodePacked(
                chainId,
                address(this),
                _ercToken,
                _amount,
                msg.sender,
                _withdrawId
            )
        );
        bytes32 signature =
        keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", message)
        );

        require(
            ECDSA.recover(signature, _signature) == signer,
            "invalid signature"
        );

        TransferHelper.safeTransfer(_ercToken, msg.sender, _amount);
        executed[_withdrawId] = true;
        emit Withdraw(_ercToken, msg.sender, _amount, _withdrawId);
    }

    function changeSigner(address _signer) external onlyOwner {
        signer = _signer;
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    ) external virtual ensure(deadline) {
        uint256 _amount = 111;
        //        uint[] memory _amounts = ITaalRouter02(router).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
        emit SwapExactTokensForTokens(msg.sender, _amount, pathx);
    }

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    ) external virtual ensure(deadline) {
        uint256 _amount = 222;
//        uint[] memory _amounts = ITaalRouter02(router).swapTokensForExactTokens(amountOut, amountInMax, path, to, deadline);
        emit SwapTokensForExactTokens(msg.sender, _amount, pathx);
    }

    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    )
    external virtual payable ensure(deadline) {
        uint256 _amount = 333;
//        uint[] memory _amounts = ITaalRouter02(router).swapExactETHForTokens{value: msg.value}(amountOutMin, path, to, deadline);
        emit SwapExactETHForTokens(msg.sender, _amount, pathx);
    }

    function swapTokensForExactETH(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    ) external virtual ensure(deadline) {
        uint256 _amount = 444;
//        uint[] memory _amounts = ITaalRouter02(router).swapTokensForExactETH(amountOut, amountInMax, path, to, deadline);
        emit SwapTokensForExactETH(msg.sender, _amount, pathx);
    }

    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    ) external virtual ensure(deadline) {
        uint256 _amount = 555;
//        uint[] memory _amounts = ITaalRouter02(router).swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline);
        emit SwapExactTokensForETH(msg.sender, _amount, pathx);
    }

    function swapETHForExactTokens(
        uint amountOutMin,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    ) external virtual payable ensure(deadline) {
//        uint[] memory _amounts = ITaalRouter02(router).swapETHForExactTokens{value: msg.value}(amountOutMin, path, to, deadline);
//        uint256 _amount = _amounts[path.length-1];
//        this.transit(taal, _amount);
        uint256 _amount = 666;
        emit SwapETHForExactTokens(msg.sender, _amount, pathx);
    }

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    ) external virtual ensure(deadline) {
        uint256 _amount = 777;
//        ITaalRouter02(router).swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, to, deadline);
        emit SwapExactTokensForTokensSupportingFeeOnTransferTokens(msg.sender, pathx);
    }

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    ) external virtual payable ensure(deadline) {
        uint256 _amount = 888;
//        ITaalRouter02(router).swapExactETHForTokensSupportingFeeOnTransferTokens{value: msg.value}(amountOutMin, path, to, deadline);
        emit SwapExactETHForTokensSupportingFeeOnTransferTokens(msg.sender, pathx);
    }

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address[] calldata pathx,
        address to,
        uint deadline
    ) external virtual ensure(deadline) {
        uint256 _amount = 999;
//        ITaalRouter02(router).swapExactTokensForETHSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, to, deadline);
        emit SwapExactTokensForETHSupportingFeeOnTransferTokens(msg.sender, pathx);
    }
}
