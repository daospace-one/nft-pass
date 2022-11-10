import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("PlanetNFT", function () {
  async function deployFixture() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
    // console.log('account', owner.address, otherAccount.address)

    const Mintable = await ethers.getContractFactory("PlanetNFT");
    const mintable = await upgrades.deployProxy(Mintable, []);
    // const mintable = await Mintable.attach("");

    // const Merger = await ethers.getContractFactory("Merger");
    // const merger = await upgrades.deployProxy(Merger, [mintable.address]);
    // const merger = await Merger.attach("");

    return { mintable, owner, otherAccount, thirdAccount };
  }

  describe("Deployment", function () {
    it("Should be mintable", async function () {
      const { mintable, owner, otherAccount, thirdAccount } = await deployFixture();

      let tx, receipt
      tx = await mintable.setMintlist([owner.address], [5], 7);
      tx = await mintable.connect(owner).mintComet(owner.address, 5);
      console.log('tx', tx)
      receipt = await tx.wait()
      console.log('receipt', receipt.events[0].args.tokenId)
      console.log('receipt', receipt.events[1].args.tokenId)
      console.log('receipt', receipt.events[2].args.tokenId)
      console.log('receipt', receipt.events[3].args.tokenId)
      console.log('receipt', receipt.events[4].args.tokenId)

      console.log('user address', owner.address)
      console.log("ownerOf(1)", await mintable.ownerOf(10000001));
      console.log("ownerOf(2)", await mintable.ownerOf(10000002));
      console.log("tokenURI(1)", await mintable.tokenURI(10000001));
      await mintable.setTokenBaseURI("https://daospace.one/nft/data/");
      console.log("tokenURI(1)", await mintable.tokenURI(10000001));

      console.log("balanceOf(owner)", await mintable.balanceOf(owner.address));
      console.log("tokenOfOwnerByIndex(owner, 0)", await mintable.tokenOfOwnerByIndex(owner.address, 0));
      console.log("tokenOfOwnerByIndex(owner, 1)", await mintable.tokenOfOwnerByIndex(owner.address, 1));
      console.log("tokenOfOwnerByIndex(owner, 2)", await mintable.tokenOfOwnerByIndex(owner.address, 2));
      console.log("tokenOfOwnerByIndex(owner, 3)", await mintable.tokenOfOwnerByIndex(owner.address, 3));
      console.log("tokenOfOwnerByIndex(owner, 4)", await mintable.tokenOfOwnerByIndex(owner.address, 4));

      tx = await mintable.mergeComet(owner.address, ["10000001", "10000002", "10000003", "10000004", "10000005"])
      receipt = await tx.wait()
      // receipt = await tx.wait()
      console.log(receipt.events.length)
      console.log('receipt', receipt.events[receipt.events.length - 1].args.tokenId)


    });
  });
});
