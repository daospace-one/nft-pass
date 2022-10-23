import { ethers, upgrades } from "hardhat";

async function mint() {
    const [owner] = await ethers.getSigners()
    const Mintable = await ethers.getContractFactory("SpacePassNFT")

    const mintable = await Mintable.attach("0x")
    console.log('SpacePassNFT address', mintable.address)
    let user = "0x"
    console.log('user', user)
    console.log('owner.address', owner.address)
    // await mintable.connect(owner).mint(user, 86400*30)

    // console.log(await mintable.ownerOf(1))
    // console.log(await mintable.balanceOf(user))
    // console.log(await mintable.connect(owner).activate(1))
    // console.log(await mintable.connect(owner).activated(1))
    // console.log(await mintable.lastActivated(user))
}

mint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
