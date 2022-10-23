import { ethers, upgrades } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    const Mintable = await ethers.getContractFactory("SpacePassNFT");
    const mintable = await upgrades.deployProxy(Mintable, []);
    // const mintable = await upgrades.upgradeProxy("0x", Mintable, []);
    console.log("mintable.address", mintable.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
