const API_BASE_URL = 'http://172.17.0.2:8001';

async function fetchData() {
    try {
        // Fetch token data
        const tokenResponse = await fetch(`${API_BASE_URL}/api/token`);
        const tokenData = await tokenResponse.json();
        document.getElementById('token-balance').textContent = 
            `${tokenData.total_supply || 0} WŁ`;

        // Fetch mining stats
        const statsResponse = await fetch(`${API_BASE_URL}/api/stats`);
        const statsData = await statsResponse.json();
        document.getElementById('blocks-mined').textContent = 
            `Blocks Mined: ${statsData.total_blocks || 0}`;
        document.getElementById('current-difficulty').textContent = 
            `Current Difficulty: ${statsData.difficulty || 4}`;

        // Update every 5 seconds
        setTimeout(fetchData, 5000);
    } catch (error) {
        console.error('Error fetching data:', error);
        setTimeout(fetchData, 5000);
    }
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);
