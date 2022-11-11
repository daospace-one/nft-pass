import { ethers, upgrades } from "hardhat";

async function main() {

let lines = []

    const [owner, otherAccount] = await ethers.getSigners();
    console.log('account', owner.address, otherAccount.address)

    let tx

    const Mintable = await ethers.getContractFactory("PlanetNFT");
    const mintable = await Mintable.attach("0x");
    console.log('COMET address', mintable.address)

    for (let i=0; i <lines.length;i+=1) {
      console.log(i, lines[i][0])
      console.log(i, lines[i][1])
      tx = await mintable.connect(otherAccount).setMintlist(lines[i][0], lines[i][1]);
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
