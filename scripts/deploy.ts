import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    const Mintable = await ethers.getContractFactory("SpacePassNFT");
    const mintable = await Mintable.connect(owner).deploy("SpacePassNFT", "SpacePassNFT", "https://daospace.one/nft/data/");
    console.log("mintable.address", mintable.address);
}


async function mint() {
    const [owner] = await ethers.getSigners()
    const Mintable = await ethers.getContractFactory("SpacePassNFT")

    const mintable = await Mintable.attach(process.env.CONTRASCT_ADDR)
    console.log('SpacePassNFT address', mintable.address)
    let user = process.env.USER_ADDR
    console.log('user', user)
    await mintable.mint(user, 3)
    console.log(await mintable.ownerOf(1))
    console.log(await mintable.connect(owner).activate(1))
    console.log(await mintable.connect(owner).activated(1))
    console.log(await mintable.lastActivated(user))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
