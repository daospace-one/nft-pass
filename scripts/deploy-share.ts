import { ethers, upgrades } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    const Mintable = await ethers.getContractFactory("DaoSpaceShare");
    const mintable = await upgrades.deployProxy(Mintable, []);
    // const mintable = await upgrades.upgradeProxy("0x", Mintable, []);
    // const mintable = await Mintable.attach("0x")
    console.log("mintable.address", mintable.address);

    // await mintable.mint(owner.address, "300000000000000000000000");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

