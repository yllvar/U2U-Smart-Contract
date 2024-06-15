# First Smart Contract with Hardhat - U2U Tutorial

Welcome to this tutorial where you'll learn how to create your first smart contract using Hardhat – a comprehensive development environment for contract compilation, deployment, and verification.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initialization](#initialization)
- [Creating Your First Smart Contract](#creating-your-first-smart-contract)
- [Writing Automated Tests](#writing-automated-tests)
- [Deploying Your Smart Contract](#deploying-your-smart-contract)

## Prerequisites
Before we begin, make sure you are familiar with the following:
- Writing code in JavaScript
- Operating a terminal
- Using Git
- Understanding the basics of how smart contracts work

## Initialization
First, let's set up our Node.js environment for U2U smart contract development.

1. Create a folder for your project:
    ```sh
    mkdir first-contract
    cd first-contract
    ```

2. Create an empty Node.js project:
    ```sh
    npm init -y
    ```

3. Add Hardhat as a dependency to the project:
    ```sh
    npm install --save-dev hardhat
    ```

4. Initialize your Hardhat project:
    ```sh
    npx hardhat init
    ```

5. Select "Create a TypeScript project" when prompted:
    ```
    888    888                      888 888               888
    888    888                      888 888               888
    888    888                      888 888               888
    8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
    888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
    888    888 .d888888 888    888  888 888  888 .d888888 888
    888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
    888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

    👷 Welcome to Hardhat v2.17.4 👷‍

    ? What do you want to do? …
      Create a JavaScript project
    ❯ Create a TypeScript project
      Create an empty hardhat.config.js
      Quit
    ```

6. Follow the prompts to complete the setup:
    ```
    ✔ What do you want to do? · Create a TypeScript project
    ✔ Hardhat project root: · /path/to/your/project
    ✔ Do you want to add a .gitignore? (Y/n) · y
    ✔ Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox)? (Y/n) · y
    ```

Your project should now contain the following folders and files:
- `contracts/`
- `scripts/`
- `test/`
- `hardhat.config.ts`

## Creating Your First Smart Contract
1. Open the `contracts` folder and locate the `Lock.sol` file. This is a sample contract initialized by Hardhat.

2. `Lock.sol` is a simple time-locked wallet contract. Below is a breakdown of its components:

    ```solidity
    // SPDX-License-Identifier: UNLICENSED
    pragma solidity ^0.8.9;

    // Uncomment this line to use console.log
    // import "hardhat/console.sol";

    contract Lock {
        uint public unlockTime;
        address payable public owner;

        event Withdrawal(uint amount, uint when);

        constructor(uint _unlockTime) payable {
            require(block.timestamp < _unlockTime, "Unlock time should be in the future");

            unlockTime = _unlockTime;
            owner = payable(msg.sender);
        }

        function withdraw() public {
            // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
            // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

            require(block.timestamp >= unlockTime, "You can't withdraw yet");
            require(msg.sender == owner, "You aren't the owner");

            emit Withdrawal(address(this).balance, block.timestamp);

            owner.transfer(address(this).balance);
        }
    }
    ```

## Writing Automated Tests
To test our contract, we'll use Hardhat Network, a local blockchain network similar to U2U network. It comes built-in with Hardhat.

1. Open the `test` folder and delete the contents of `Lock.ts`.

2. Structure your test file like this:

    ```typescript
    import { expect } from "chai";
    import { ethers } from "hardhat";
    import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

    describe("Lock", function () {
        it("Should set the right unlockTime", async function () {
            const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
            const ONE_GWEI = 1_000_000_000;

            const lockedAmount = ONE_GWEI;
            const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

            const Lock = await ethers.getContractFactory("Lock");
            const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

            expect(await lock.unlockTime()).to.equal(unlockTime);
        });

        it("Should set the right owner", async function () {
            const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
            const ONE_GWEI = 1_000_000_000;

            const lockedAmount = ONE_GWEI;
            const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
            const [owner] = await ethers.getSigners();

            const Lock = await ethers.getContractFactory("Lock");
            const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

            expect(await lock.owner()).to.equal(owner.address);
        });
    });
    ```

3. Run your tests:
    ```sh
    npx hardhat test
    ```

## Deploying Your Smart Contract
After testing your contract, you can deploy it to the U2U network.

1. Create a deployment script `deploy.ts` in the `scripts` folder:

    ```typescript
    import { ethers } from "hardhat";

    async function main() {
        const currentTimestampInSeconds = Math.round(Date.now() / 1000);
        const unlockTime = currentTimestampInSeconds + 60;

        const lockedAmount = ethers.parseEther("0.001");

        const lock = await ethers.deployContract("Lock", [unlockTime], {
            value: lockedAmount,
        });

        await lock.waitForDeployment();

        console.log(
            `Lock with ${ethers.formatEther(lockedAmount)} U2U and unlock timestamp ${unlockTime} deployed to ${lock.target}`
        );
    }

    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
    ```

2. Configure the network in `hardhat.config.ts`:

    ```typescript
    import { HardhatUserConfig } from "hardhat/config";
    import "@nomicfoundation/hardhat-toolbox";

    const config: HardhatUserConfig = {
        solidity: "0.8.19",
        networks: {
            nebulas: {
                url: 'https://rpc-nebulas-testnet.uniultra.xyz/',
                accounts: ["YOUR_PRIVATE_KEY"], // it should start with 0x...
            }
        },
        etherscan: {
            apiKey: {
                nebulas: "abc", // arbitrary string
            },
            customChains: [
                {
                    network: "nebulas",
                    chainId: 2484,
                    urls: {
                        apiURL: "https://testnet.u2uscan.xyz/api",
                        browserURL: "https://testnet.u2uscan.xyz"
                    }
                },
            ]
        }
    };

    export default config;
    ```

3. Run the deployment script:
    ```sh
    npx hardhat run scripts/deploy.ts --network nebulas
    ```
