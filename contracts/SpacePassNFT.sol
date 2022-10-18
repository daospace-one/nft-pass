pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SpacePassNFT is ERC721, AccessControl {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseURI;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER");

    mapping(address => uint256) private _minted;
    mapping(uint256 => uint256) private _activated;
    mapping(uint256 => uint256) private _pass_type;

    event BaseURIChanged(string newBaseURI);
    event RootChanged(bytes32 newRoot);

    error URIQueryForNonexistentToken();

    constructor(string memory name, string memory symbol, string memory _baseURI) ERC721(name, symbol) {
        baseURI = _baseURI;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return
            super.supportsInterface(interfaceId);
    }

    function mint(address to, uint256 pass_type) external {
        require(hasRole(MINTER_ROLE, msg.sender), "caller is not a minter");

        uint256 tokenId = _tokenIds.current();
        _safeMint(to, tokenId);
        _pass_type[tokenId] = pass_type;

        _tokenIds.increment();
    }

    function activate(uint256 tokenId) public returns(bool) {
        require(hasRole(MINTER_ROLE, msg.sender) || ownerOf(tokenId) == msg.sender, "caller is not a minter or the owner");

        _activated[tokenId] = block.timestamp;

        return true;
    }

    function activated(uint256 tokenId) public view returns(uint256) {
        return _activated[tokenId];
    }

    function passType(uint256 tokenId) public view returns(uint256) {
        return _pass_type[tokenId];
    }

    function expires(uint256 tokenId) public view returns(uint256) {
        if (_activated[tokenId] == 0) {
            return 0;
        } else if (_pass_type[tokenId] == 1) {
            return _activated[tokenId] + 86400;
        } else if (_pass_type[tokenId] == 2) {
            return _activated[tokenId] + 7*86400;
        } else if (_pass_type[tokenId] == 3) {
            return _activated[tokenId] + 30*86400;
        }
    }

    function mintBatch(address[] calldata addrs, uint256[] calldata ids) external {
        require(addrs.length == ids.length, "invalid data");
        require(hasRole(MINTER_ROLE, msg.sender), "caller is not a minter");

        for (uint256 i = 0; i < addrs.length; i+=1) {
            _safeMint(addrs[i], ids[i]);
        }
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : '';
    }

    function setTokenURI(string memory _baseURI) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "caller is not a minter");

        baseURI = _baseURI;
        emit BaseURIChanged(_baseURI);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        if (_activated[tokenId] > 0) {
            revert("cannot be transferred when activated");
        }
    }
}
