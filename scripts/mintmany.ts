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

    tx = await mintable.connect(owner).mintAndActivateBatch(
      ['0x','0x'], 
      [
      Math.floor(Number(new Date('2022-11-01'))/1000),
      Math.floor(Number(new Date('2022-11-01'))/1000),
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
