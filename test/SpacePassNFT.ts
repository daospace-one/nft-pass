import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("SpacePassNFT", function () {
  async function deployFixture() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
    // console.log('account', owner.address, otherAccount.address)

    const Mintable = await ethers.getContractFactory("SpacePassNFT");
    const mintable = await upgrades.deployProxy(Mintable, []);
    // const mintable = await Mintable.attach("");

    return { mintable, owner, otherAccount, thirdAccount };
  }

  describe("Deployment", function () {
    it("Should be mintable", async function () {
      const { mintable, owner, otherAccount, thirdAccount } = await deployFixture();

      let tx1 = await mintable.connect(owner).mint(owner.address, 86400);
      let tx2 = await mintable.connect(owner).mint(owner.address, 86400);
      console.log('tx1', tx1)
      let receipt = await tx1.wait()
      console.log('receipt', receipt.events[0].args.tokenId)

      console.log('user address', owner.address)
      console.log("ownerOf(1)", await mintable.ownerOf(1));
      console.log("ownerOf(2)", await mintable.ownerOf(2));
      console.log("tokenURI(1)", await mintable.tokenURI(1));
      await mintable.setTokenURI("https://daospace.one/nft/data/");
      console.log("tokenURI(1)", await mintable.tokenURI(1));
      console.log("activated(1)", await mintable.activated(1));
      await mintable.connect(owner).activate(1, 0);
      console.log("activated(1)", await mintable.activated(1));
      console.log("duration(1)", await mintable.duration(1));
      console.log("expires(1)", await mintable.expires(1));
      console.log("lastActivated(owner)", await mintable.lastActivated(owner.address));

      console.log("balanceOf(owner)", await mintable.balanceOf(owner.address));
      console.log("tokenOfOwnerByIndex(owner, 0)", await mintable.tokenOfOwnerByIndex(owner.address, 0));
      console.log("tokenOfOwnerByIndex(owner, 1)", await mintable.tokenOfOwnerByIndex(owner.address, 1));
      console.log("status(owner, 1)", await mintable.status(1));

      await mintable.connect(owner).activate(2, 1666000000);
      console.log("activated(2)", await mintable.activated(2));
    });

    it("Should be mintable in batch", async function () {
      const { mintable, owner, otherAccount, thirdAccount } = await deployFixture();

      let tx1 = await mintable.connect(owner).mintAndActivateBatch([owner.address], [Math.floor(Number(new Date('2022-10-01'))/1000)], 86400 * 30);
      console.log(mintable)
      let tx2 = await mintable.connect(owner).mintMany([owner.address], 86400 * 30);
      console.log("activated(1)", await mintable.activated(1));
      console.log("activated(2)", await mintable.activated(2));
      console.log("ownerOf(1)", await mintable.ownerOf(1));
      console.log("ownerOf(2)", await mintable.ownerOf(2));
      
    });

    it("Should not be transferrable when activated", async function () {
      const { mintable, owner, otherAccount, thirdAccount } = await deployFixture();

      await mintable.connect(owner).mint(owner.address, 1);
      console.log('user address', owner.address)
      console.log("ownerOf(1)", await mintable.ownerOf(1));
      console.log("tokenURI(1)", await mintable.tokenURI(1));
      await mintable.setTokenURI("https://daospace.one/nft/data/");
      console.log("tokenURI(1)", await mintable.tokenURI(1));
      await mintable['safeTransferFrom(address,address,uint256)'](owner.address, thirdAccount.address, 1);
      console.log("activated(1)", await mintable.activated(1));
      // await expect(mintable.connect(otherAccount).activate(1, 0)).revertedWith("caller is not a minter or the owner");
      await mintable.connect(owner).activate(1, 0);
      console.log("activated(1)", await mintable.activated(1));
      // await expect(mintable.connect(thirdAccount)['safeTransferFrom(address,address,uint256)'](thirdAccount.address, owner.address, 1)).revertedWith("cannot be transferred when activated");
      console.log("burn(1)", await mintable.connect(owner).burn(1));
    });

    it("Should be mintable in batch", async function () {
      const { mintable, owner, otherAccount } = await deployFixture();

      await mintable.connect(owner).mintBatch([owner.address, otherAccount.address], [1,2]);
      console.log("ownerOf(1)", await mintable.ownerOf(1));
      console.log("ownerOf(2)", await mintable.ownerOf(2));


      console.log(await mintable.DEFAULT_ADMIN_ROLE())
      let adminRole = await mintable.DEFAULT_ADMIN_ROLE()
      let minterRole = await mintable.MINTER_ROLE()
      console.log(await mintable.hasRole(adminRole, otherAccount.address));
      console.log(await mintable.hasRole(adminRole, owner.address));

      console.log(await mintable.hasRole(minterRole, otherAccount.address));
      console.log(await mintable.hasRole(minterRole, owner.address));

      // await expect(mintable.connect(otherAccount).mintBatch([owner.address, otherAccount.address], [3,4])).revertedWith("caller is not a minter");
      
      await mintable.connect(owner).grantRole(minterRole, otherAccount.address)

      console.log(await mintable.hasRole(minterRole, owner.address));
      await mintable.connect(otherAccount).mintBatch([owner.address, otherAccount.address], [5,6]);

    });
  });
});
