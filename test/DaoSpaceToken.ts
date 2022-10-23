import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("DaoSpaceToken", function () {
  async function deployFixture() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("DaoSpaceToken");
    const mintable = await upgrades.deployProxy(Token, []);
    // const token = await Token.attach("");

    return { mintable, owner, otherAccount, thirdAccount };
  }

  describe("Deployment", function () {
    it("Should be mintable", async function () {
      const { mintable, owner, otherAccount, thirdAccount } = await deployFixture();

      await mintable.connect(owner).mint(otherAccount.address, 10000);
      console.log('user address', otherAccount.address)
      console.log("balanceOf(otherAccount.address)", await mintable.balanceOf(otherAccount.address));
      console.log("burn(otherAccount.address)", await mintable.connect(otherAccount).burn(100));
      console.log("balanceOf(otherAccount.address)", await mintable.balanceOf(otherAccount.address));
    });
  });
});
