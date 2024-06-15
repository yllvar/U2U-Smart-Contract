import { ethers } from "hardhat";
import { Lock } from "../typechain-types";

async function main() {
    const [owner] = await ethers.getSigners();

    const lockAddr = "0x5983b8d1eD06FeB637923b06de2b3d486E41fc0C"
    const Lock = await ethers.getContractFactory("Lock")
    const lock = await Lock.attach(lockAddr) as Lock

    const tx = await lock.withdraw()
    console.log("Withdrawal has completed. Transaction hash: " + tx.hash)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});