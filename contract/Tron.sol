// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;


contract TokenTRC20 {
    // Public variables of the token
    string public name;
    string public symbol;
    // 18 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;

    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    /*
     *
     * Constructor function
     * Initializes contract with initial supply tokens to the creator of the contract
     * Update total supply with the decimal amount
     * Give the creator all initial tokens
     * Set the name for display purposes
     * Set the symbol for display purposes
     *
     */

    uint256 initialSupply = 100;
    string tokenName = "TRC20_Token";
    string tokenSymbol = "TRX";
    uint8 public decimals = 8;
    
    constructor()  
    {
        totalSupply = initialSupply;             
        balanceOf[msg.sender] = totalSupply;    
        name = tokenName;                        
        symbol = tokenSymbol;                    
    }

    /**
     *
     * external transfer, only can be called by outside of this contract
     *  // Prevent transfer to 0x0 address. Use burn() instead
     *  // Check if the sender has enough funds to transfer
     *  // Check for overflows
     *  // Save this for an assertion in the future
     *  // Subtract from the sender
     *  // Add the same to the recipient
     *  // Asserts are used to use static analysis to find bugs in your code. They should never fail
     *  
     */   
    function _transfer(address _from, address _to, uint _value) external {
       
        require(_to != address(0x0));
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]); 
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    /*
     *
     * balanceOfAnyAddress function
     * Takes address as a parameter
     * Returns the balance of that address in uint
     *
     */

    function balanceOfAnyAddress(address _address) external view returns(uint){
        return address(_address).balance;
        }

}