import { ethers } from 'ethers';
import { lowRiskVault } from './contracts'; // Assuming 'lowRiskVault' is correctly imported from your contracts file

/**
 * Parses a transaction receipt to find and format a specific event for the low-risk vault.
 * @param {ethers.TransactionReceipt} receipt The transaction receipt.
 * @param {ethers.Contract} contract The contract instance to get the interface from.
 * @param {string} eventName The name of the event to find.
 * @returns {object|null} The parsed event arguments or null if not found.
 */
function getEventFromReceiptLow(receipt, contract, eventName) {
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
                    raw: parsedLog.args // Include raw arguments for debugging or more detailed use
                };
            }
        } catch (error) {
            // This log was not from our contract, ignore and continue
            // console.warn("Could not parse log, likely not from our contract:", log);
        }
    }
    return null;
}

export async function depositLow(amount) {
    const contract = await lowRiskVault();

    try {
        const tx = await contract.deposit(
            // The amount is parsed into the smallest unit (6 decimals)
            ethers.parseUnits(amount.toString(), 6)
        );
        // Wait for the transaction to be mined and get the receipt
        const receipt = await tx.wait();

        // Find and parse the 'VaultDeposit' event from the receipt
        const depositEvent = getEventFromReceiptLow(receipt, contract, 'VaultDeposit');
        console.log('Low-risk Deposit successful. Event:', depositEvent);

        // Return the parsed event data
        return depositEvent;
    }
    catch (error) {
        console.error("Error in depositLow:", error);
        return null;
    }
}

export async function withdrawLow(amount) {
    const contract = await lowRiskVault();

    try {
        const tx = await contract.withdraw(ethers.parseUnits(amount.toString(), 6));
        const receipt = await tx.wait();

        // Find and parse the 'VaultWithdraw' event from the receipt
        const withdrawEvent = getEventFromReceiptLow(receipt, contract, 'VaultWithdraw');
        console.log('Low-risk Withdrawal successful. Event:', withdrawEvent);

        // Return the parsed event data
        return withdrawEvent;
    }
    catch (error) {
        console.error("Error in withdrawLow:", error);
        return null;
    }
}


// =============================================
// NEW: Functions to Query Historical Events for Low-Risk Vault
// =============================================

/**
 * Fetches and parses past events from the low-risk vault contract.
 * @param {string} eventName The name of the event to query (e.g., 'VaultDeposit', 'VaultWithdraw').
 * @param {string | number} fromBlock The starting block number, or 'earliest'.
 * @param {string | number} toBlock The ending block number, or 'latest'.
 * @returns {Promise<Array<object>|null>} A promise that resolves to an array of parsed event objects.
 */
export async function getPastEventsLow(eventName, fromBlock = 'earliest', toBlock = 'latest') {
    const contract = await lowRiskVault();
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
                // Check if the key is a numeric index (ethers.js adds both named and indexed properties)
                if (!isNaN(Number(key))) {
                    continue; // Skip numeric indices
                }
                
                if (typeof value === 'bigint') {
                    // Adjust the decimals based on the argument name if necessary
                    // Assuming 'assets' and 'shares' have 6 decimals, others (like potentially a timestamp or block number if it were a BigInt) might have 18 (ether)
                    const decimals = (key === 'assets' || key === 'shares') ? 6 : 18; // Default to 18 for other BigInts if not explicitly 6
                    formattedArgs[key] = ethers.formatUnits(value, decimals);
                } else {
                    formattedArgs[key] = value;
                }
            }
            return {
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
                eventName: parsedLog.name,
                ...formattedArgs
            };
        });
    } catch (error) {
        console.error(`Error in getPastEventsLow for ${eventName}:`, error);
        return null;
    }
}


// =============================================
// View Functions (Unchanged)
// =============================================

export async function getPricePerShareLow() {
    const contract = await lowRiskVault();

    try {
        const pricePerShare = await contract.getPricePerShare();
        // The contract returns price with 1e18 precision
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
        // Assuming totalAssets are returned with 1e18 precision based on the original code
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
        // The balance is in the smallest unit (6 decimals)
        return ethers.formatUnits(balance, 6);
    } catch (error) {
        console.error("Error in getBalanceLow:", error);
        return null;
    }
}