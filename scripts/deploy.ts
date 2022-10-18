import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    const Mintable = await ethers.getContractFactory("SpacePassNFT");
    const mintable = await Mintable.connect(owner).deploy("SpacePassNFT", "SpacePassNFT", "https://daospace.one/nft/data/");
    console.log('SpacePassNFT address', mintable.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
