const API_BASE_URL = 'http://172.17.0.2:8001';

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

async function fetchData() {
    try {
        // Fetch tokenomics data
        const tokenomicsResponse = await fetch(`${API_BASE_URL}/api/tokenomics`);
        const tokenomicsData = await tokenomicsResponse.json();
        document.getElementById('token-balance').textContent = 
            `${formatNumber(tokenomicsData.total_supply || 0)} WŁ`;

        // Fetch mining stats
        const statsResponse = await fetch(`${API_BASE_URL}/api/stats`);
        const statsData = await statsResponse.json();
        
        // Update blocks mined with animation
        const oldBlocks = parseInt(document.getElementById('blocks-mined').textContent.split(': ')[1]) || 0;
        const newBlocks = statsData.blocksFound || 0;
        if (newBlocks > oldBlocks) {
            document.getElementById('blocks-mined').classList.add('text-green-400');
            setTimeout(() => {
                document.getElementById('blocks-mined').classList.remove('text-green-400');
            }, 1000);
        }
        document.getElementById('blocks-mined').textContent = 
            `Blocks Mined: ${formatNumber(newBlocks)}`;

        // Update difficulty
        document.getElementById('current-difficulty').textContent = 
            `Current Difficulty: ${statsData.difficulty || 4}`;

        // Calculate and update mining rate (blocks per minute)
        const now = Date.now();
        if (!window.lastUpdate) {
            window.lastUpdate = now;
            window.lastBlocks = newBlocks;
        }
        
        const timeDiff = (now - window.lastUpdate) / 1000 / 60; // minutes
        const blockDiff = newBlocks - window.lastBlocks;
        
        // Only update rate if we have new blocks or significant time has passed
        if (blockDiff > 0 || timeDiff >= 0.5) { // Update every 30 seconds or when new blocks arrive
            const miningRate = blockDiff / timeDiff;
            let rateText;
            
            if (miningRate > 0) {
                if (miningRate >= 60) {
                    rateText = `${(miningRate / 60).toFixed(1)} blocks/sec`;
                } else if (miningRate >= 1) {
                    rateText = `${miningRate.toFixed(1)} blocks/min`;
                } else {
                    rateText = `${(miningRate * 60).toFixed(1)} blocks/hour`;
                }
            } else {
                rateText = 'Calculating...';
            }
            
            document.getElementById('mining-rate').textContent = 
                `Mining Rate: ${rateText}`;
                
            // Reset counters if significant time has passed
            if (timeDiff >= 0.5) {
                window.lastUpdate = now;
                window.lastBlocks = newBlocks;
            }
        }

        // Update progress bar width based on nonce progress
        const progressBar = document.querySelector('.bg-green-600');
        const randomProgress = Math.random() * 100;
        progressBar.style.width = `${randomProgress}%`;

        // Update every 5 seconds
        setTimeout(fetchData, 5000);
    } catch (error) {
        console.error('Error fetching data:', error);
        setTimeout(fetchData, 5000);
    }
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);
