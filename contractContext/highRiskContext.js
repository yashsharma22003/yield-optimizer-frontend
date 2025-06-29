import { ethers } from 'ethers';
import { highRiskVault } from './contracts';

/**
 * Parses a transaction receipt to find and format a specific event.
 * @param {ethers.TransactionReceipt} receipt The transaction receipt.
 * @param {ethers.Contract} contract The contract instance to get the interface from.
 * @param {string} eventName The name of the event to find.
 * @returns {object|null} The parsed event arguments or null if not found.
 */
function getEventFromReceipt(receipt, contract, eventName) {
    // The receipt.logs contains all events emitted in the transaction.
    // We can find our specific event by its signature.
    for (const log of receipt.logs) {
        try {
            const parsedLog = contract.interface.parseLog(log);
            if (parsedLog && parsedLog.name === eventName) {
                // Return a structured object with the event arguments.
                // We format the BigInt amounts to a more readable string format.
                // Assuming the asset has 6 decimals as per the original script.
                return {
                    user: parsedLog.args.user,
                    assets: ethers.formatUnits(parsedLog.args.assets, 6),
                    shares: ethers.formatUnits(parsedLog.args.shares, 6), // Assuming shares also have 6 decimals for consistency
                    raw: parsedLog.args
                };
            }
        } catch (error) {
            // This log was not from our contract, ignore and continue
        }
    }
    return null;
}


export async function depositHigh(amount) {
    const contract = await highRiskVault();
    try {
        const tx = await contract.deposit(
            // The amount is parsed into the smallest unit (6 decimals)
            ethers.parseUnits(amount.toString(), 6)
        );
        // Wait for the transaction to be mined and get the receipt
        const receipt = await tx.wait();

        // Find and parse the 'VaultDeposit' event from the receipt
        const depositEvent = getEventFromReceipt(receipt, contract, 'VaultDeposit');
        console.log('Deposit successful. Event:', depositEvent);

        // Return the parsed event data
        return depositEvent;
    }
    catch (error) {
        console.error("Error in depositHigh:", error);
        return null;
    }
}

export async function withdrawHigh(amount) {
    const contract = await highRiskVault();
    try {
        const tx = await contract.withdraw(ethers.parseUnits(amount.toString(), 6));
        const receipt = await tx.wait();

        // Find and parse the 'VaultWithdraw' event from the receipt
        const withdrawEvent = getEventFromReceipt(receipt, contract, 'VaultWithdraw');
        console.log('Withdrawal successful. Event:', withdrawEvent);
        
        // Return the parsed event data
        return withdrawEvent;
    }
    catch (error) {
        console.error("Error in withdrawHigh:", error);
        return null;
    }
}


// =============================================
// NEW: Functions to Query Historical Events
// =============================================

/**
 * Fetches and parses past events from the vault contract.
 * @param {string} eventName The name of the event to query (e.g., 'VaultDeposit').
 * @param {string | number} fromBlock The starting block number, or 'earliest'.
 * @param {string | number} toBlock The ending block number, or 'latest'.
 * @returns {Promise<Array<object>|null>} A promise that resolves to an array of parsed event objects.
 */
export async function getPastEvents(eventName, fromBlock = 'earliest', toBlock = 'latest') {
    const contract = await highRiskVault();
    try {
        // Create a filter for the specified event
        const eventFilter = contract.filters[eventName]();
        
        // Query the blockchain for logs matching the filter
        const logs = await contract.queryFilter(eventFilter, fromBlock, toBlock);

        // Map over the logs and return a clean array of the event arguments
        return logs.map(log => {
            const parsedLog = contract.interface.parseLog(log);
            const formattedArgs = {};
            // Format all BigInt values to string for readability
            for (const key in parsedLog.args) {
                const value = parsedLog.args[key];
                if (typeof value === 'bigint') {
                    // Adjust the decimals based on the argument name if necessary
                    const decimals = (key === 'assets' || key === 'shares') ? 6 : 'ether';
                    formattedArgs[key] = ethers.formatUnits(value, decimals);
                } else {
                    formattedArgs[key] = value;
                }
            }
            return {
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                ...formattedArgs
            };
        });
    } catch (error) {
        console.error(`Error in getPastEvents for ${eventName}:`, error);
        return null;
    }
}


// =============================================
// View Functions (Unchanged)
// =============================================

export async function getPricePerShareHigh() {
    const contract = await highRiskVault();
    try {
        const pricePerShare = await contract.getPricePerShare();
        // The contract returns price with 1e18 precision
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
        // Assuming totalAssets are returned with 1e18 precision based on the original code
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
        // The balance is in the smallest unit (6 decimals)
        return ethers.formatUnits(balance, 6);
    } catch (error) {
        console.error("Error in getBalanceHigh:", error);
        return null;
    }
}