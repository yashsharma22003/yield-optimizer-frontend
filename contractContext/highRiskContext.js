import { ethers } from 'ethers';
import { highRiskVault } from './contracts';


export async function depositHigh(amount) {

    const contract = await highRiskVault();

    try {
        const tx = await contract.deposit(
            ethers.parseUnits(amount.toString(), 6)
        )

        await tx.wait();
        return true;
    }
    catch (error) {
        console.error("Error in depositHigh:", error);
        return false;
    }

}

export async function withdrawHigh(amount) {
    const contract = await highRiskVault();

    try {
        const tx = await contract.withdraw(ethers.parseUnits(amount.toString(), 6));
        await tx.wait();
        return true;
    }
    catch (error) {
        console.error("Error in withdrawHigh:", error);
        return false;
    }

}


///// view functions

export async function getPricePerShareHigh() {
    const contract = await highRiskVault();

    try {
        const pricePerShare = await contract.getPricePerShare();
        return ethers.formatEther(pricePerShare);
    } catch (error) {
        console.error("Error in getPricePerShareHigh:", error);
        return null;
    }
}

export async function getTotalAssetsHigh() {
    const contract = await highRiskVault();

    try {
        const totalAssets = await contract.totalAssets();
        return ethers.formatEther(totalAssets);
    } catch (error) {
        console.error("Error in totalAssetsHigh:", error);
        return null;
    }
}

export async function getBalanceHigh(account) {
    const contract = await highRiskVault();

    try {
        const balance = await contract.balanceOf(account);
        return ethers.formatUnits(balance, 6);
    } catch (error) {
        console.error("Error in getBalanceHigh:", error);
        return null;
    }
}
