pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract PlanetNFT is ERC721EnumerableUpgradeable, AccessControlUpgradeable {
    using StringsUpgradeable for uint256;
    string public baseURI;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER");
    mapping(address => uint256) private _mintlist;

    // Comet, Mercury, Mars, Venus, Saturn, Jupiter
    uint256 _counter;
    uint256 _factor;
    PlanetNFT _source;

    event BaseURIChanged(string newBaseURI);
    event RootChanged(bytes32 newRoot);
    event MintlistUpdated(address indexed addr, uint256 amount);

    error URIQueryForNonexistentToken();


    function initialize(string calldata name, string calldata symbol, string calldata uri, uint256 counter, address source) initializer public {
      __ERC721_init(name, symbol);
      __AccessControl_init();
      _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
      _setupRole(MINTER_ROLE, _msgSender());
      baseURI = uri;

      _source = PlanetNFT(source);
      _counter = counter;
      _factor = 5;
     }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721EnumerableUpgradeable, AccessControlUpgradeable) returns (bool) {
        return interfaceId == type(ERC721EnumerableUpgradeable).interfaceId ||
            interfaceId == type(AccessControlUpgradeable).interfaceId ||
             super.supportsInterface(interfaceId);
     }

    function setMintlist(address[] calldata addrs, uint256[] calldata amounts) external {
        require(hasRole(MINTER_ROLE, _msgSender()), "caller is not a minter");
        require(addrs.length == amounts.length, "invalid data");

        for (uint256 i = 0; i < addrs.length; i+=1) {
          _mintlist[addrs[i]] = amounts[i];
          emit MintlistUpdated(addrs[i], amounts[i]);
        }
    }

    function updateMintlist(address[] calldata addrs, uint256[] calldata amounts) external {
        require(hasRole(MINTER_ROLE, _msgSender()), "caller is not a minter");
        require(addrs.length == amounts.length, "invalid data");

        for (uint256 i = 0; i < addrs.length; i+=1) {
          _mintlist[addrs[i]] += amounts[i];
          emit MintlistUpdated(addrs[i], amounts[i]);
        }
    }

    function getMintlistBalance(address addr) external view returns (uint256) {
        return _mintlist[addr];
    }

    function burnPlanet(address addr, uint256[] calldata tokenIds) public returns (uint256) {
        require(tokenIds.length >= _factor, "insufficient comets");

        for (uint256 i = 0; i < tokenIds.length; i+=1) {
            uint256 tokenId = tokenIds[i];
            require(_source.isApprovedOrOwner(addr, tokenId), "ERC721: not token owner nor approved");
            _source.burn(tokenId);
        }
    }

    function merge(address addr, uint256[] calldata tokenIds) external returns (uint256) {
        burnPlanet(addr, tokenIds);

        _counter += 1;
        _safeMint(addr, _counter);

        return _counter;
    }

    function mint(address addr, uint256 amount) external returns (uint256) {
        require(_mintlist[addr] >= amount, "insufficient balance in mintlist");
        _mintlist[addr] -= amount;

        for (uint256 i = 0; i < amount; i+=1) {
            _counter += 1;
            _safeMint(addr, _counter);
        }

        return _counter;
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view virtual returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }

    function burn(uint256 tokenId) public virtual {
        require(_isApprovedOrOwner(_msgSender(), tokenId) || hasRole(MINTER_ROLE, _msgSender()), "ERC721: caller is not token owner nor minter");
        _burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : '';
    }

    function setTokenBaseURI(string memory _baseURI) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "caller is not a minter");

        baseURI = _baseURI;
        emit BaseURIChanged(_baseURI);
    }

    function setFactor(uint256 factor) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "caller is not admin");
        _factor = factor;
    }

    function getFactor() external returns (uint256) {
        return _factor;
    }
}
