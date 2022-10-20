pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract SpacePassNFT is ERC721EnumerableUpgradeable, AccessControlUpgradeable {
    using StringsUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    string public baseURI;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER");

    mapping(address => uint256) private _last_activated;
    mapping(uint256 => uint256) private _activated;
    mapping(uint256 => uint256) private _duration;

    event BaseURIChanged(string newBaseURI);
    event RootChanged(bytes32 newRoot);

    error URIQueryForNonexistentToken();

    function initialize() initializer public {
      __ERC721_init("SpacePassNFT", "PASS");
      __AccessControl_init();
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setupRole(MINTER_ROLE, msg.sender);
      baseURI = "https://daospace.one/nft/data/";
      _tokenIds.increment();
     }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721EnumerableUpgradeable, AccessControlUpgradeable) returns (bool) {
        return interfaceId == type(ERC721EnumerableUpgradeable).interfaceId ||
            interfaceId == type(AccessControlUpgradeable).interfaceId ||
             super.supportsInterface(interfaceId);
     }

    function mint(address to, uint256 duration) external {
        require(hasRole(MINTER_ROLE, msg.sender), "caller is not a minter");

        uint256 tokenId = _tokenIds.current();
        _safeMint(to, tokenId);
        _duration[tokenId] = duration;

        _tokenIds.increment();
    }

    function activate(uint256 tokenId) public returns(bool) {
        require(hasRole(MINTER_ROLE, msg.sender) || ownerOf(tokenId) == msg.sender, "caller is not a minter or the owner");

        _activated[tokenId] = block.timestamp;
        _last_activated[ownerOf(tokenId)] = tokenId;

        return true;
    }

    function activated(uint256 tokenId) public view returns(uint256) {
        return _activated[tokenId];
    }

    function lastActivated(address addr) public view returns(uint256) {
        return _last_activated[addr];
    }

    function duration(uint256 tokenId) public view returns(uint256) {
        return _duration[tokenId];
    }

    function expires(uint256 tokenId) public view returns(uint256) {
        if (_activated[tokenId] == 0) {
            return 0;
        } else {
            return _activated[tokenId] + _duration[tokenId];
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
        super._beforeTokenTransfer(from, to, tokenId);
        if (_activated[tokenId] > 0) {
            revert("cannot be transferred when activated");
        }
    }
}
