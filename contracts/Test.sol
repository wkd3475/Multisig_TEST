pragma solidity ^0.4.24;

contract Test {
    int public a;
    address owner;

    constructor (address _owner) public {
        owner = _owner;
    }

    modifier onlyOwner {
        if (msg.sender != owner) {
            revert("not owner");
        }
        _;
    }

    function changeOwner(address to) public onlyOwner {
        owner = to;
    }

    function who() public view returns (address) {
        return owner;
    }
    
    function changeA() public onlyOwner {
        a = a + 1;
    }
}