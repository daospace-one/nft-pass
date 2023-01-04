import { ethers, upgrades } from "hardhat";

async function mint() {
    const [owner] = await ethers.getSigners()
    const Mintable = await ethers.getContractFactory("SpacePassNFT")
    const mintable = await Mintable.attach("0xF94AEc47Decd15655755b4feb0D7399b7fEE3145")
    console.log('SpacePassNFT address', mintable.address)

    let user
    let tx
    let receipt

    console.log('owner.address', owner.address)
    // console.log(await mintable.balanceOf("0xd4A6CF8D8bF6A3dC4aB0A5f137a892f335e22Bb6"))

    // let MINTER_ROLE = await mintable.MINTER_ROLE()
    // console.log(await mintable.hasRole(MINTER_ROLE, owner.address))

    tx = await mintable.connect(owner).mintAndActivateBatch(
      [
        '0x',
        ],
      [
      Math.floor(Number(new Date('2022-01-01'))/1000),
      ], 86400 * 30);
    console.log(tx)

    // console.log(await mintable.ownerOf(tokenId))
    // console.log(await mintable.balanceOf(user))
    // console.log(await mintable.connect(owner).activated(1))
    // console.log(await mintable.lastActivated(user))
}

mint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
