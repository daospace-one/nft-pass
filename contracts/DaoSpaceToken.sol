// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract DaoSpaceToken is ERC20Upgradeable, AccessControlUpgradeable {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER");

    function initialize() initializer public {
      __ERC20_init("DAOSpace", "DST");
      __AccessControl_init();
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setupRole(MINTER_ROLE, msg.sender);
     }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlUpgradeable) returns (bool) {
        return interfaceId == type(AccessControlUpgradeable).interfaceId ||
             super.supportsInterface(interfaceId);
     }

    function mint(address addr, uint256 amount) external {
        require(hasRole(MINTER_ROLE, msg.sender), "caller is not a minter");

        _mint(addr, amount);
    }
    
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

}