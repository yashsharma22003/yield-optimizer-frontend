import { ethers } from 'ethers';
import { lowRiskVault } from './contracts';


export async function depositLow(amount) {
    const contract = await lowRiskVault();

    try {
        const tx = await contract.deposit(
               ethers.parseUnits(amount.toString(), 6)
        );

        await tx.wait();
        return true;
    }
    catch (error) {
        console.error("Error in depositLow:", error);
        return false;
    }
}

export async function withdrawLow(amount) {
    const contract = await lowRiskVault();

    try {
        const tx = await contract.withdraw(ethers.parseUnits(amount.toString(), 6));
        await tx.wait();
        return true;
    }
    catch (error) {
        console.error("Error in withdrawLow:", error);
        return false;
    }
}



// View functions

export async function getPricePerShareLow() {
    const contract = await lowRiskVault();

    try {
        const pricePerShare = await contract.getPricePerShare();
        return ethers.formatEther(pricePerShare);
    } catch (error) {
        console.error("Error in getPricePerShareLow:", error);
        return null;
    }
}

export async function getTotalAssetsLow() {
    const contract = await lowRiskVault();

    try {
        const totalAssets = await contract.totalAssets();
        return ethers.formatEther(totalAssets);
    } catch (error) {
        console.error("Error in getTotalAssetsLow:", error);
        return null;
    }
}

export async function getBalanceLow(account) {
    const contract = await lowRiskVault();

    try {
        const balance = await contract.balanceOf(account);
        return ethers.formatEther(balance);
    } catch (error) {
        console.error("Error in getBalanceLow:", error);
        return null;
    }
}
