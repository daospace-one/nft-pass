pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

import "./PlanetNFT.sol";

contract Merger is AccessControlUpgradeable, IERC721ReceiverUpgradeable {

    PlanetNFT public planet;
    mapping(address => uint256) private _mercury_collection;

    function initialize(address planetAddr) initializer public {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        planet = PlanetNFT(planetAddr);
    }

    bytes4 public constant ERC721Received = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        _mercury_collection[from] = _mercury_collection[from] + 1;
        return ERC721Received;
    }

    function merge(
        ) external {
        address addr = msg.sender;
        
        if (_mercury_collection[addr] >= 2) {
            _mercury_collection[addr] -= 2;
        }

        planet.mintComet(addr, 1);
    }

}

