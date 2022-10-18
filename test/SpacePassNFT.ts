import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

import { expect } from "chai";
import { ethers } from "hardhat";

describe("SpacePassNFT", function () {
  async function deployFixture() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
    // console.log('account', owner.address, otherAccount.address)

    const Mintable = await ethers.getContractFactory("SpacePassNFT");
    const mintable = await Mintable.connect(otherAccount).deploy("SuperToken", "SuperToken", "http://google.com/");
    // const mintable = await Mintable.attach("");

    return { mintable, owner, otherAccount, thirdAccount };
  }

  describe("Deployment", function () {
    it("Should be mintable", async function () {
      const { mintable, owner, otherAccount, thirdAccount } = await deployFixture();

      await mintable.connect(otherAccount).mint(otherAccount.address);
      console.log('user address', otherAccount.address)
      console.log("ownerOf(0)", await mintable.ownerOf(0));
      console.log("tokenURI(0)", await mintable.tokenURI(0));
      await mintable.setTokenURI("https://daospace.one/nft/data/");
      console.log("tokenURI(0)", await mintable.tokenURI(0));
      console.log("activated(0)", await mintable.activated(0));
      await mintable.connect(otherAccount).activate(0);
      console.log("activated(0)", await mintable.activated(0));
    });

    it("Should not be transferrable when activated", async function () {
      const { mintable, owner, otherAccount, thirdAccount } = await deployFixture();

      await mintable.connect(otherAccount).mint(otherAccount.address);
      console.log('user address', otherAccount.address)
      console.log("ownerOf(0)", await mintable.ownerOf(0));
      console.log("tokenURI(0)", await mintable.tokenURI(0));
      await mintable.setTokenURI("https://daospace.one/nft/data/");
      console.log("tokenURI(0)", await mintable.tokenURI(0));
      await mintable['safeTransferFrom(address,address,uint256)'](otherAccount.address, thirdAccount.address, 0);
      console.log("activated(0)", await mintable.activated(0));
      await expect(mintable.connect(owner).activate(0)).revertedWith("caller is not a minter or the owner");
      await mintable.connect(otherAccount).activate(0);
      console.log("activated(0)", await mintable.activated(0));
      await expect(mintable.connect(thirdAccount)['safeTransferFrom(address,address,uint256)'](thirdAccount.address, otherAccount.address, 0)).revertedWith("cannot be transferred when activated");
    });

    it("Should be mintable in batch", async function () {
      const { mintable, owner, otherAccount } = await deployFixture();

      await mintable.connect(otherAccount).mintBatch([owner.address, otherAccount.address], [0,1]);
      console.log("ownerOf(0)", await mintable.ownerOf(0));
      console.log("ownerOf(1)", await mintable.ownerOf(1));


      console.log(await mintable.DEFAULT_ADMIN_ROLE())
      let adminRole = await mintable.DEFAULT_ADMIN_ROLE()
      let minterRole = await mintable.MINTER_ROLE()
      console.log(await mintable.hasRole(adminRole, otherAccount.address));
      console.log(await mintable.hasRole(adminRole, owner.address));

      console.log(await mintable.hasRole(minterRole, otherAccount.address));
      console.log(await mintable.hasRole(minterRole, owner.address));

      await expect(mintable.connect(owner).mintBatch([owner.address, otherAccount.address], [3,4])).revertedWith("caller is not a minter");
      
      await mintable.connect(otherAccount).grantRole(minterRole, owner.address)

      console.log(await mintable.hasRole(minterRole, owner.address));
      await mintable.connect(owner).mintBatch([owner.address, otherAccount.address], [5,6]);

    });
  });
});
