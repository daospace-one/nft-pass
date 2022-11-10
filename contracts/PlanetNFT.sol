pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract PlanetNFT is ERC721EnumerableUpgradeable, AccessControlUpgradeable {
    using StringsUpgradeable for uint256;
    // using CountersUpgradeable for CountersUpgradeable.Counter;
    // CountersUpgradeable.Counter private _tokenIds;

    string public baseURI;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER");
    mapping(address => mapping(uint256 => uint256)) private _mintlist;
    // mapping(uint256 => uint256) private _counter;

    // Comet, Mercury, Mars, Venus, Saturn, Jupiter
    uint256 _comet_counter;
    uint256 _mercury_counter;
    uint256 _mars_counter;
    uint256 _venus_counter;
    uint256 _saturn_counter;
    uint256 _jupiter_counter;
    uint256 _x_counter;

    uint256 _factor;

    event BaseURIChanged(string newBaseURI);
    event RootChanged(bytes32 newRoot);

    error URIQueryForNonexistentToken();

    function initialize() initializer public {
      __ERC721_init("PlanetNFT", "PNT");
      __AccessControl_init();
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _setupRole(MINTER_ROLE, msg.sender);
      baseURI = "https://planet-nft.pns.link/nft/data/";

      _comet_counter   = 10000000;
      _mercury_counter = 1000000;
      _mars_counter    = 100000;
      _venus_counter   = 10000;
      _saturn_counter  = 1000;
      _jupiter_counter = 100;
      _x_counter = 0;

      _factor = 5;
     }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721EnumerableUpgradeable, AccessControlUpgradeable) returns (bool) {
        return interfaceId == type(ERC721EnumerableUpgradeable).interfaceId ||
            interfaceId == type(AccessControlUpgradeable).interfaceId ||
             super.supportsInterface(interfaceId);
     }

    function setMintlist(address[] calldata addrs, uint256[] calldata amounts, uint256 kind) external {
        require(hasRole(MINTER_ROLE, msg.sender), "caller is not a minter");
        require(addrs.length == amounts.length, "invalid data");

        for (uint256 i = 0; i < addrs.length; i+=1) {
          _mintlist[addrs[i]][kind] += amounts[i];
        }
    }

    function burnPlanet(address addr, uint256[] calldata tokenIds, uint256 scale) public returns (uint256) {
        require(tokenIds.length >= _factor, "insufficient comets");

        for (uint256 i = 0; i < tokenIds.length; i+=1) {
            uint256 tokenId = tokenIds[i];
            require(_isApprovedOrOwner(addr, tokenId) && tokenId < scale, "ERC721: not token owner nor approved");
            _burn(tokenId);
        }
    }

    function mergeComet(address addr, uint256[] calldata tokenIds) external returns (uint256) {
        burnPlanet(addr, tokenIds, 100000000);

        _mercury_counter += 1;
        _safeMint(addr, _mercury_counter);

        return _mercury_counter;
    }

    function mintComet(address addr, uint256 amount) external returns (uint256) {
        require(_mintlist[addr][7] >= amount, "insufficient balance in mintlist");
        _mintlist[addr][7] -= amount;

        for (uint256 i = 0; i < amount; i+=1) {
            _comet_counter += 1;
            _safeMint(addr, _comet_counter);
        }

        return _comet_counter;
    }

    function mintMercury(address addr, uint256 amount) external returns (uint256) {
        require(_mintlist[addr][6] >= amount, "insufficient balance in mintlist");
        _mintlist[addr][6] -= amount;

        for (uint256 i = 0; i < amount; i+=1) {
            _mercury_counter += 1;
            _safeMint(addr, _mercury_counter);
        }

        return _mercury_counter;
    }

    function mintMars(address addr, uint256 amount) external returns (uint256) {
        require(_mintlist[addr][5] >= amount, "insufficient balance in mintlist");
        _mintlist[addr][5] -= amount;

        for (uint256 i = 0; i < amount; i+=1) {
            _mars_counter += 1;
            _safeMint(addr, _mars_counter);
        }

        return _mars_counter;
    }

    function mintVenus(address addr, uint256 amount) external returns (uint256) {
        require(_mintlist[addr][4] >= amount, "insufficient balance in mintlist");
        _mintlist[addr][4] -= amount;

        for (uint256 i = 0; i < amount; i+=1) {
            _venus_counter += 1;
            _safeMint(addr, _venus_counter);
        }

        return _venus_counter;
    }

    function mintSaturn(address addr, uint256 amount) external returns (uint256) {
        require(_mintlist[addr][3] >= amount, "insufficient balance in mintlist");
        _mintlist[addr][3] -= amount;

        for (uint256 i = 0; i < amount; i+=1) {
            _saturn_counter += 1;
            _safeMint(addr, _saturn_counter);
        }

        return _saturn_counter;
    }

    function mintJupiter(address addr, uint256 amount) external returns (uint256) {
        require(_mintlist[addr][2] >= amount, "insufficient balance in mintlist");
        _mintlist[addr][2] -= amount;

        for (uint256 i = 0; i < amount; i+=1) {
            _jupiter_counter += 1;
            _safeMint(addr, _jupiter_counter);
        }

        return _jupiter_counter;
    }

    function mintX(address addr, uint256 amount) external returns (uint256) {
        require(_mintlist[addr][1] >= amount, "insufficient balance in mintlist");
        _mintlist[addr][1] -= amount;

        for (uint256 i = 0; i < amount; i+=1) {
            _x_counter += 1;
            _safeMint(addr, _x_counter);
        }

        return _x_counter;
    }

    function burn(uint256 tokenId) public virtual {
        require(_isApprovedOrOwner(_msgSender(), tokenId) || hasRole(MINTER_ROLE, msg.sender), "ERC721: caller is not token owner nor minter");
        _burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : '';
    }

    function setTokenBaseURI(string memory _baseURI) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "caller is not a minter");

        baseURI = _baseURI;
        emit BaseURIChanged(_baseURI);
    }

    function setFactor(uint256 factor) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "caller is not admin");
        _factor = factor;
    }

    function factor() external returns (uint256) {
        return _factor;
    }
}
