from web3 import Web3
import json

rpc_endpoint = "https://rpc.api.moonbeam.network"
w3 = Web3(Web3.HTTPProvider(rpc_endpoint))

abi_path = "artifacts/contracts/SpacePassNFT.sol/SpacePassNFT.json"
file = open(abi_path, "r")
data = file.read()
file.close()
abi = json.loads(data)["abi"]

address = "0x"
# contract_address = "0x43f5bAc85d84f6cc4f4d838B1f523f511497973D"
contract_address = "0xce6685530FbA7cC34538149B2278e213Ce73FcDa"
passnft = w3.eth.contract(
    address=contract_address,
    abi=abi
)

# 获得合约名称
print(passnft.functions.name().call())

# 检查 NFT Token 1 的 owner
passnft.functions.ownerOf(1).call()

# 获得 NFT Token 1 的 metadata
passnft.functions.tokenURI(1).call()

# 获得 NFT Token 1 的有效时长，一天有效期则 86400，30天则 86400*30
passnft.functions.duration(1).call()

# 获得 NFT Token 1 的过期时间
passnft.functions.expires(1).call()

# 获得 NFT Token 1 是否激活
passnft.functions.activated(1).call()

# 获得用户当前被激活的 Token
print(passnft.functions.lastActivated(address).call())

# 以下方法用于枚举用户的 NFT

# 获得用户持有的 Token 数量，使用这个数量进行枚举
print(passnft.functions.balanceOf(address).call())

# 获得用户持有的第0个 Token 的 Token ID
print(passnft.functions.tokenOfOwnerByIndex(address, 0).call())
