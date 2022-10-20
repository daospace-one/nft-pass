import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    const Mintable = await ethers.getContractFactory("SpacePassNFT");
    const mintable = await upgrades.deployProxy(Mintable, []);
    console.log("mintable.address", mintable.address);
}


async function mint() {
    const [owner] = await ethers.getSigners()
    const Mintable = await ethers.getContractFactory("SpacePassNFT")

    const mintable = await Mintable.attach("0x")
    console.log('SpacePassNFT address', mintable.address)
    let user = process.env.USER_ADDR
    console.log('user', user)
    await mintable.connect(owner).mint(user, 86400*30)
    await mintable.connect(owner).mint(user, 86400*30)

    console.log(await mintable.ownerOf(1))
    console.log(await mintable.connect(owner).activate(1))
    console.log(await mintable.connect(owner).activated(1))
    console.log(await mintable.lastActivated(user))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
