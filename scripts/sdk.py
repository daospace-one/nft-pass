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

print(passnft.functions.name().call())
passnft.functions.ownerOf(1).call()
passnft.functions.tokenURI(1).call()
passnft.functions.duration(1).call()
passnft.functions.expires(1).call()
passnft.functions.activated(1).call()
print(passnft.functions.lastActivated(address).call())