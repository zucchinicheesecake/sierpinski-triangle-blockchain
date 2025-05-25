"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  Activity,
  Triangle,
  Zap,
  Database,
  Network,
  Loader,
  Wallet,
  Send,
  RefreshCw,
  Plus,
} from "lucide-react";

interface TokenData {
  token_name: string;
  symbol: string;
  initial_supply: number;
  owner: string;
  creation_time: number;
}

interface WalletData {
  address: string;
  private_key: string;
}

interface TokenomicsData {
  total_supply: number;
  holder_count: number;
  transaction_count: number;
  mining_reward: number;
  node_wallet: string;
  node_balance: number;
}

interface PeerData {
  url: string;
  status: 'connected' | 'disconnected';
  lastSeen?: string;
}

interface BlockData {
  position: [number, number];
  transaction_hash: string;
  prev_hash: string;
  parent_refs: Array<[number, number]>;
  child_ptrs: Array<[number, number]>;
  metadata: any;
  timestamp: number;
  geometric_coords: Array<[number, number]>;
}

interface ChainData {
  height: number;
  last_block_hash: string;
  is_valid: boolean;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  hash: string;
}

interface MiningReward {
  cell_location: string;
  miner: string;
  amount: number;
  timestamp: number;
  transaction: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

// Configure fetch options for CORS
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors' as RequestMode,
  credentials: 'omit' as RequestCredentials
};

const SierpinskiDashboard = () => {
  const [isMining, setIsMining] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isCreatingToken, setIsCreatingToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<WalletData | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tokenomics, setTokenomics] = useState<TokenomicsData | null>(null);
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [transferError, setTransferError] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);

  const [stats, setStats] = useState({
    hashRate: 0,
    blocksFound: 0,
    triangleCount: 1,
    difficulty: 4,
    nonce: 0,
    currentHash: "",
    validTriangles: [],
    networkNodes: 3,
    consensus: 67,
    totalRewards: 0,
    rewardsCount: 0,
    averageReward: 0
  });

  const [peers, setPeers] = useState<PeerData[]>([]);
  const [chainData, setChainData] = useState<ChainData>({
    height: 0,
    last_block_hash: '',
    is_valid: true
  });
  const [latestBlocks, setLatestBlocks] = useState<BlockData[]>([]);

  const [miningRewards, setMiningRewards] = useState<MiningReward[]>([]);

  // Function to fetch transaction history
  const fetchTransactionHistory = async (address: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallet/history/${address}`, fetchConfig);
      const data = await response.json();
      if (data.status === "success") {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  // Fetch mining rewards
  const fetchMiningRewards = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rewards`, fetchConfig);
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setMiningRewards(data.rewards);
        }
      }
    } catch (error) {
      console.error('Error fetching mining rewards:', error);
    }
  };

  // Function to fetch tokenomics data
  const fetchTokenomics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tokenomics`, fetchConfig);
      const data = await response.json();
      if (data.status === "success") {
        setTokenomics(data);
      }
    } catch (error) {
      console.error("Error fetching tokenomics:", error);
    }
  };

  // Poll for tokenomics and mining rewards data
  useEffect(() => {
    fetchMiningRewards();
    fetchTokenomics();
    const rewardsInterval = setInterval(fetchMiningRewards, 2000);
    const tokenomicsInterval = setInterval(fetchTokenomics, 5000);
    return () => {
      clearInterval(rewardsInterval);
      clearInterval(tokenomicsInterval);
    };
  }, []);

  const createTokenRef = useRef<HTMLDivElement>(null);

  // Fetch token data
  const fetchTokenData = async () => {
    try {
      console.log('Fetching token data...');
      const url = `${API_BASE_URL}/api/token`;
      console.log('Request URL:', url);

      const response = await fetch(url, fetchConfig);
      const data = await response.json();
      console.log('Token response:', response.status, data);
      
      if (response.ok) {
        setTokenData(data);
        setTokenError(null);
      } else {
        const errorMessage = data.error || 'Token not found';
        console.error('Token fetch failed:', errorMessage);
        setTokenError(errorMessage);
        // Scroll to create token section when no token is found
        createTokenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      setTokenError('Error fetching token data: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Create token
  const createToken = async () => {
    setIsCreatingToken(true);
    setTokenError(null);
    try {
      console.log('Creating token...');
      const url = `${API_BASE_URL}/api/token/create`;
      console.log('Request URL:', url);
      
      const requestData = {
        initial_supply: 1000000,
        owner_address: 'owner_ABC123'
      };
      console.log('Request data:', requestData);

      const response = await fetch(url, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setTokenData(data.token);
        console.log('Token created successfully:', data);
        // Fetch token data again to ensure we have the latest state
        await fetchTokenData();
      } else {
        const errorMessage = data.error || 'Failed to create token';
        console.error('Token creation failed:', errorMessage);
        setTokenError(errorMessage);
      }
    } catch (error) {
      console.error('Error creating token:', error);
      setTokenError('Error creating token: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsCreatingToken(false);
    }
  };

  // Fetch mining stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`, fetchConfig);
      if (response.ok) {
        const data = await response.json();
        setStats(prevStats => ({
          ...prevStats,
          ...data,
          hashRate: data.hashRate || prevStats.hashRate,
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch peer data
  const fetchPeers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/peers`, fetchConfig);
      if (response.ok) {
        const data = await response.json();
        setPeers(data.peers.map((url: string) => ({ url, status: 'connected' })));
      }
    } catch (error) {
      console.error('Error fetching peers:', error);
    }
  };

  // Fetch chain data
  const fetchChainData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chain/validate`, {
        ...fetchConfig,
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setChainData({
          height: data.height,
          last_block_hash: data.last_block_hash,
          is_valid: data.valid
        });
      }
    } catch (error) {
      console.error('Error validating chain:', error);
    }
  };

  // Fetch latest blocks
  const fetchLatestBlocks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ledger`, fetchConfig);
      if (response.ok) {
        const data = await response.json();
        // Get the last 5 blocks from the ledger
        const blocks: BlockData[] = [];
        const ledger = data.ledger;
        for (let i = ledger.length - 1; i >= Math.max(0, ledger.length - 5); i--) {
          blocks.push(...ledger[i]);
        }
        setLatestBlocks(blocks.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching latest blocks:', error);
    }
  };

  // Poll for stats and chain data
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchStats(),
        fetchPeers(),
        fetchChainData(),
        fetchLatestBlocks()
      ]);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch token data on component mount
  useEffect(() => {
    fetchTokenData();
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miningIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start/Stop mining
  const toggleMining = () => {
    if (isMining) {
      if (miningIntervalRef.current) {
        clearInterval(miningIntervalRef.current);
        miningIntervalRef.current = null;
      }
      setIsMining(false);
    } else {
      setIsMining(true);
      fetchStats(); // Immediate fetch
      miningIntervalRef.current = setInterval(fetchStats, 100);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (miningIntervalRef.current) {
        clearInterval(miningIntervalRef.current);
      }
    };
  }, []);

  // Draw Sierpinski triangle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw main triangle
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(50, 250);
    ctx.lineTo(350, 250);
    ctx.closePath();
    ctx.stroke();

    // Draw subdivisions based on triangle count
    const levels = Math.min(Math.floor(Math.log2(stats.triangleCount)), 4);
    for (let i = 0; i < levels; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 - i * 0.2})`;
      ctx.lineWidth = Math.max(1, 2 - i * 0.3);

      // Draw fractal subdivisions (simplified)
      const scale = Math.pow(0.5, i + 1);
      const baseSize = 150 * scale;

      for (let j = 0; j < Math.pow(3, i); j++) {
        const x = 200 + (Math.random() - 0.5) * baseSize;
        const y = 150 + (Math.random() - 0.5) * baseSize;

        ctx.beginPath();
        ctx.moveTo(x, y - baseSize / 2);
        ctx.lineTo(x - baseSize / 2, y + baseSize / 2);
        ctx.lineTo(x + baseSize / 2, y + baseSize / 2);
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Highlight valid triangles
    if (Array.isArray(stats.validTriangles)) {
      stats.validTriangles.forEach((triangle: any, index: number) => {
        if (triangle.coordinates) {
          ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + index * 0.1})`;
          ctx.beginPath();
          ctx.moveTo(triangle.coordinates[0][0], triangle.coordinates[0][1]);
          ctx.lineTo(triangle.coordinates[1][0], triangle.coordinates[1][1]);
          ctx.lineTo(triangle.coordinates[2][0], triangle.coordinates[2][1]);
          ctx.closePath();
          ctx.fill();
        }
      });
    }
  }, [stats.triangleCount, stats.validTriangles]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">
          Sierpinski Triangle Blockchain
        </h1>
        <p className="text-gray-400 text-lg">
          Development Dashboard & Mining Console
        </p>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mining Control Panel */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <Zap className="text-yellow-400" />
              Mining Control
            </h2>
            <div
              className={`w-4 h-4 rounded-full ${
                isMining ? "bg-green-400 animate-pulse" : "bg-red-600"
              }`}
            ></div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={toggleMining}
                className={`flex-1 flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                  isMining
                    ? "bg-red-700 hover:bg-red-800 text-white"
                    : "bg-green-700 hover:bg-green-800 text-white"
                }`}
              >
                {isMining ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause Mining
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Mining
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsMining(false);
                  if (miningIntervalRef.current) {
                    clearInterval(miningIntervalRef.current);
                    miningIntervalRef.current = null;
                  }
                  setStats(prev => ({
                    ...prev,
                    hashRate: 0,
                    blocksFound: 0,
                    triangleCount: 1,
                    nonce: 0,
                    currentHash: "",
                    validTriangles: [],
                  }));
                }}
                className="flex-1 flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-800 text-white transition-colors duration-300"
              >
                <Square className="w-5 h-5" />
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Hash Rate
                </h3>
                <p className="text-2xl font-bold">{stats.hashRate.toFixed(2)} H/s</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Blocks Found
                </h3>
                <p className="text-2xl font-bold">{stats.blocksFound}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Triangles
                </h3>
                <p className="text-2xl font-bold">{stats.triangleCount}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Difficulty
                </h3>
                <p className="text-2xl font-bold">{stats.difficulty}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Nonce
                </h3>
                <p className="text-2xl font-bold">{stats.nonce}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Current Hash
                </h3>
                <p className="text-xs font-mono break-words">{stats.currentHash}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Canvas Display */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <Triangle className="text-cyan-400" />
            Sierpinski Triangle
          </h2>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="rounded-lg border border-gray-700 bg-black"
          />
        </section>

        {/* Władysłaium Token Info */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Database className="text-purple-400" />
            Władysłaium Token
          </h2>
          <div className="space-y-4">
            {tokenError && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
                {tokenError}
              </div>
            )}
            
            {tokenData ? (
              <>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                    Token Name
                  </h3>
                  <p className="text-2xl font-bold">{tokenData.token_name}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                    Symbol
                  </h3>
                  <p className="text-2xl font-bold">{tokenData.symbol}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                    Initial Supply
                  </h3>
                  <p className="text-2xl font-bold">
                    {tokenData.initial_supply.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                    Owner
                  </h3>
                  <p className="text-sm font-mono break-words">{tokenData.owner}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                    Created At
                  </h3>
                  <p className="text-sm">
                    {new Date(tokenData.creation_time * 1000).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <div 
                ref={createTokenRef}
                className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg mt-4 border-2 border-purple-500"
              >
                <p className="text-gray-400 mb-6 text-xl">No token found. Create one to get started.</p>
                <button
                  data-testid="create-token-button"
                  id="create-token-button"
                  onClick={(e) => {
                    e.preventDefault();
                    const button = e.currentTarget;
                    console.log('Create Token button clicked');
                    console.log('Button coordinates:', e.clientX, e.clientY);
                    console.log('Button dimensions:', button.getBoundingClientRect());
                    console.log('Button position:', {
                      top: button.offsetTop,
                      left: button.offsetLeft,
                      width: button.offsetWidth,
                      height: button.offsetHeight
                    });
                    createToken();
                  }}
                  disabled={isCreatingToken}
                  className={`w-full max-w-md h-20 flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-bold text-xl ${
                    isCreatingToken
                      ? 'bg-purple-900 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 animate-pulse'
                  } text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-400`}
                >
                  {isCreatingToken ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Database className="w-6 h-6" />
                      Create Token
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Mining Rewards Info */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Activity className="text-yellow-400" />
            Mining Rewards
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Total Rewards
                </h3>
                <p className="text-2xl font-bold">{stats.totalRewards} WŁ</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Average Reward
                </h3>
                <p className="text-2xl font-bold">{stats.averageReward.toFixed(2)} WŁ</p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                Recent Rewards
              </h3>
              {miningRewards.length > 0 ? (
                <div className="space-y-3">
                  {miningRewards.map((reward, index) => (
                    <div key={index} className="border-b border-gray-700 pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold">{reward.amount} WŁ</p>
                          <p className="text-xs text-gray-400">Miner: {reward.miner}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(reward.timestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No rewards yet</p>
              )}
            </div>
          </div>
        </section>

        {/* Wallet Management */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Wallet className="text-blue-400" />
            Wallet Management
          </h2>
          
          {currentWallet ? (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Wallet Address
                </h3>
                <p className="text-sm font-mono break-all">{currentWallet.address}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Balance
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{walletBalance} WŁ</p>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`${API_BASE_URL}/api/wallet/balance/${currentWallet.address}`, fetchConfig);
                        const data = await response.json();
                        if (data.status === "success") {
                          setWalletBalance(data.balance);
                        }
                      } catch (error) {
                        console.error("Error refreshing balance:", error);
                      }
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Token Transfer */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                  Transfer Tokens
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg p-2 text-white"
                  />
                  {transferError && (
                    <p className="text-red-400 text-sm">{transferError}</p>
                  )}
                  <button
                    onClick={async () => {
                      setTransferError(null);
                      setIsTransferring(true);
                      try {
                        const response = await fetch(`${API_BASE_URL}/api/wallet/transfer`, {
                          ...fetchConfig,
                          method: 'POST',
                          body: JSON.stringify({
                            from_address: currentWallet.address,
                            to_address: recipientAddress,
                            amount: parseInt(transferAmount),
                            private_key: currentWallet.private_key,
                          }),
                        });
                        const data = await response.json();
                        if (data.status === "success") {
                          setTransferAmount("");
                          setRecipientAddress("");
                          // Refresh balance and transaction history
                          const balanceResponse = await fetch(`${API_BASE_URL}/api/wallet/balance/${currentWallet.address}`);
                          const balanceData = await balanceResponse.json();
                          if (balanceData.status === "success") {
                            setWalletBalance(balanceData.balance);
                          }
                          fetchTransactionHistory(currentWallet.address);
                        } else {
                          setTransferError(data.error);
                        }
                      } catch (error) {
                        setTransferError("Transfer failed: " + error);
                      } finally {
                        setIsTransferring(false);
                      }
                    }}
                    disabled={isTransferring || !recipientAddress || !transferAmount}
                    className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg font-semibold ${
                      isTransferring || !recipientAddress || !transferAmount
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isTransferring ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Transfer
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                  Transaction History
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {transactions.map((tx, index) => (
                    <div key={index} className="border-b border-gray-700 pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm">
                            {tx.from === currentWallet.address ? "Sent" : "Received"}{" "}
                            {tx.amount} WŁ
                          </p>
                          <p className="text-xs text-gray-400">
                            {tx.from === currentWallet.address
                              ? `To: ${tx.to.slice(0, 8)}...`
                              : `From: ${tx.from.slice(0, 8)}...`}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.timestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-400">No wallet connected</p>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`${API_BASE_URL}/api/wallet/create`, {
                      ...fetchConfig,
                      method: 'POST'
                    });
                    const data = await response.json();
                    if (data.status === "success") {
                      setCurrentWallet({
                        address: data.address,
                        private_key: data.private_key,
                      });
                      setWalletBalance(0);
                      fetchTransactionHistory(data.address);
                    }
                  } catch (error) {
                    console.error("Error creating wallet:", error);
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                <Plus className="w-5 h-5" />
                Create Wallet
              </button>
            </div>
          )}
        </section>

        {/* Tokenomics Info */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Activity className="text-green-400" />
            Tokenomics
          </h2>
          {tokenomics && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Total Supply
                </h3>
                <p className="text-2xl font-bold">{tokenomics.total_supply} WŁ</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Holders
                </h3>
                <p className="text-2xl font-bold">{tokenomics.holder_count}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Transactions
                </h3>
                <p className="text-2xl font-bold">{tokenomics.transaction_count}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Mining Reward
                </h3>
                <p className="text-2xl font-bold">{tokenomics.mining_reward} WŁ</p>
              </div>
            </div>
          )}
        </section>

        {/* P2P Network Status */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Network className="text-green-400" />
            P2P Network Status
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Connected Peers
                </h3>
                <p className="text-2xl font-bold">{peers.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Consensus (%)
                </h3>
                <p className="text-2xl font-bold">{stats.consensus}</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                Peer List
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {peers.map((peer, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-sm font-mono truncate flex-1">{peer.url}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      peer.status === 'connected' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {peer.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={async () => {
                const url = prompt('Enter peer URL (e.g., ws://localhost:8765)');
                if (url) {
                  try {
                    const response = await fetch(`${API_BASE_URL}/api/peers`, {
                      ...fetchConfig,
                      method: 'POST',
                      body: JSON.stringify({ peer_url: url })
                    });
                    if (response.ok) {
                      fetchPeers();
                    }
                  } catch (error) {
                    console.error('Error adding peer:', error);
                  }
                }
              }}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Peer
            </button>
          </div>
        </section>

        {/* Immutable Ledger Status */}
        <section className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Database className="text-blue-400" />
            Immutable Ledger Status
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Chain Height
                </h3>
                <p className="text-2xl font-bold">{chainData.height}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                  Chain Status
                </h3>
                <p className={`text-lg font-bold ${chainData.is_valid ? 'text-green-400' : 'text-red-400'}`}>
                  {chainData.is_valid ? 'Valid' : 'Invalid'}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                Latest Block Hash
              </h3>
              <p className="text-sm font-mono break-all">{chainData.last_block_hash}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                Recent Blocks
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {latestBlocks.map((block, index) => (
                  <div key={index} className="p-2 bg-gray-700 rounded">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-gray-400">
                        Position: ({block.position[0]}, {block.position[1]})
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(block.timestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-mono truncate mt-1">
                      Hash: {block.transaction_hash.slice(0, 16)}...
                    </p>
                    <p className="text-xs font-mono text-gray-400 truncate">
                      Prev: {block.prev_hash ? block.prev_hash.slice(0, 16) + '...' : 'Genesis'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SierpinskiDashboard;
