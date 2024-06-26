const { assert, expect } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", function () {

    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy();
    })

    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0"
        
        assert.equal(currentValue.toString(), expectedValue)
        // expect -> same as assert
        // expect(currentValue.toString()).to.equal(expectedValue)
    })

    it("Should update when store is called", async function () {
        const expectedValue = "52"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue)
    })
    
})