import { ethers, upgrades } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    const Mintable = await ethers.getContractFactory("DaoSpaceToken");
    const mintable = await upgrades.deployProxy(Mintable, []);
    // const mintable = await upgradesoxy("0x", Mintable, []);
    // const mintable = await Mintable.attach("0x")
    console.log("mintable.address", mintable.address);

    await mintable.mint(owner.address, "1000000000000000000000000");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

