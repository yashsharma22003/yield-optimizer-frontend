import {usdcToken} from "./contracts";
import { ethers } from 'ethers';

export async function approveUSDC(vault,amount) {
    const contract = await usdcToken();
    
    try {
        const tx = await contract.approve(
            vault,
            ethers.parseUnits(amount.toString(), 6) // USDC has 6 decimals
        );

        await tx.wait();
        return true;
    } catch (error) {
        console.error("Error in approveUSDC:", error);
        return false;
    }
}