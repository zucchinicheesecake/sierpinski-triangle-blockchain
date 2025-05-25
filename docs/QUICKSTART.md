# Władysłaium Quick Start Guide

## Prerequisites
- Python 3.8+
- Web browser
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wladyslaium.git
cd wladyslaium
```

2. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

## Running the Node

1. Start the API server:
```bash
python3 backend/src/api_server.py
```
This will:
- Initialize the blockchain node
- Start the P2P network
- Begin mining operations
- Launch the API server on port 8001

2. Start the frontend server:
```bash
python3 -m http.server 8000 -d frontend/static
```

3. Access the mining dashboard:
```
http://localhost:8000/dashboard.html
```

## Using the Dashboard

The mining dashboard provides real-time information about:
- Token Balance and Total Supply
- Mining Status and Active Node
- Blocks Mined Count
- Current Mining Difficulty
- Mining Rate (automatically adjusts units)
- Mining Progress Indicator

## API Endpoints

### Token Operations
- GET `/api/token` - Get token information
- GET `/api/tokenomics` - Get token economics data
- POST `/api/token/create` - Create new tokens

### Mining Operations
- GET `/api/stats` - Get mining statistics
- GET `/api/rewards` - Get mining rewards history

### Wallet Operations
- POST `/api/wallet/create` - Create new wallet
- GET `/api/wallet/balance/<address>` - Get wallet balance
- POST `/api/wallet/transfer` - Transfer tokens
- GET `/api/wallet/history/<address>` - Get transaction history

### Network Operations
- GET `/api/peers` - List connected peers
- POST `/api/peers` - Add new peer
- GET `/api/chain/validate` - Validate blockchain
- GET `/api/block/<hash>` - Get block details

## Development

### Project Structure
```
wladyslaium/
├── backend/
│   ├── src/
│   │   ├── api_server.py
│   │   ├── blockchain_node.py
│   │   ├── p2p_network.py
│   │   ├── triangular_ledger.py
│   │   └── wladyslaium_token.py
│   └── requirements.txt
├── frontend/
│   └── static/
│       ├── dashboard.html
│       └── dashboard.js
└── docs/
    ├── QUICKSTART.md
    └── WHITEPAPER.md
```

### Key Components
- `api_server.py`: REST API and main entry point
- `blockchain_node.py`: Core node implementation
- `triangular_ledger.py`: Triangular blockchain implementation
- `wladyslaium_token.py`: Token management
- `p2p_network.py`: Peer-to-peer networking

## Troubleshooting

### Common Issues

1. Port already in use:
```bash
pkill -f "python3" && sleep 2
```

2. Mining not starting:
- Ensure API server is running
- Check logs for any initialization errors
- Verify network connectivity

3. Dashboard not updating:
- Check browser console for errors
- Verify API server is running
- Ensure correct port configuration

### Getting Help
- Check the whitepaper for detailed documentation
- Review API endpoints for specific operations
- Monitor server logs for debugging information

## Next Steps
1. Create a wallet
2. Start mining
3. Monitor mining progress
4. Try token transfers
5. Explore API endpoints

For detailed technical information, refer to the WHITEPAPER.md document.
