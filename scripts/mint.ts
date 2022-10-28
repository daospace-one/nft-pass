import { ethers, upgrades } from "hardhat";

async function mint() {
    const [owner] = await ethers.getSigners()
    const Mintable = await ethers.getContractFactory("SpacePassNFT")

    console.log('owner.address', owner.address)
    const mintable = await Mintable.attach("0x")
    console.log('SpacePassNFT address', mintable.address)
    let user
    let tx
    let receipt

    user = "0x"
    console.log('user', user)
    tx = await mintable.connect(owner).mint(user, 86400*30)
    receipt = await tx.wait()
    let tokenId = receipt.events[0].args.tokenId
    console.log('receipt tokenId', tokenId)
    tx = await mintable.connect(owner).activate(tokenId, Math.floor(Number(new Date('2022-10-15'))/1000))
    receipt = await tx.wait()
    console.log('receipt', receipt)

    console.log(await mintable.ownerOf(tokenId))
    // console.log(await mintable.balanceOf(user))
    // console.log(await mintable.connect(owner).activate(1))
    // console.log(await mintable.connect(owner).activated(1))
    // console.log(await mintable.lastActivated(user))
}

mint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
