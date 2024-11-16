'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Timer,
  Trophy,
  History,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import Navbar from '@/components/navbar';


type CryptoPair = {
  id: string;
  name: string;
  icon: () => JSX.Element;
  color: string;
  gradient: string;
};

type PriceData = {
  timestamp: number;
  price: number;
};

type BetHistory = {
  timestamp: string;
  amount: number;
  direction: string;
  outcome: string;
  profit: number;
};

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

const cryptoPairs: CryptoPair[] = [

  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: () => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#F7931A" />
        <path d="M15.5 9.5C15.5 8.12 14.38 7 13 7H10V12H13C14.38 12 15.5 10.88 15.5 9.5Z" fill="white" />
        <path d="M13 12H10V17H13C14.38 17 15.5 15.88 15.5 14.5C15.5 13.12 14.38 12 13 12Z" fill="white" />
      </svg>
    ),
    color: '#F7931A',
    gradient: 'from-[#F7931A] to-[#FFB74D]',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: () => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M12 2L3 12L12 22L21 12L12 2Z" fill="#627EEA" />
        <path d="M12 2L3 12L12 16V2Z" fill="white" fillOpacity="0.6" />
        <path d="M12 2L21 12L12 16V2Z" fill="white" />
      </svg>
    ),
    color: '#627EEA',
    gradient: 'from-[#627EEA] to-[#8799F0]',
  },
  {
    id: 'near',
    name: 'Near',
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 96 96" fill="none">
        <path d="M47.8948 95.1217C74.162 95.1217 95.4557 73.828 95.4557 47.5608C95.4557 21.2937 74.162 0 47.8948 0C21.6277 0 0.333984 21.2937 0.333984 47.5608C0.333984 73.828 21.6277 95.1217 47.8948 95.1217Z" fill="#00EC97"/>
        <path d="M62.1632 26.1583L52.2547 40.8229C51.462 42.0119 53.0473 43.201 53.84 42.0119L63.7485 33.6888C64.1449 33.2924 64.5412 33.6888 64.5412 34.0851V60.6399C64.5412 61.0363 64.1449 61.0363 63.7485 61.0363L34.023 25.762C33.2303 24.573 31.645 23.7803 30.0596 23.7803H29.2669C26.4925 23.7803 24.1145 26.1583 24.1145 28.9327V66.1887C24.1145 68.9631 26.4925 71.3411 29.2669 71.3411C30.8523 71.3411 32.834 70.5484 33.6267 68.9631L43.5352 54.2985C44.3279 53.1095 42.7425 51.9204 41.9498 53.1095L32.0413 61.4326C31.645 61.829 31.2486 61.4326 31.2486 61.0363V34.4815C31.645 34.0851 32.0413 33.6888 32.0413 34.0851L61.7668 69.3594C62.5595 70.5484 64.1449 71.3411 65.7302 71.3411H66.9193C69.6936 71.3411 72.0717 68.9631 72.0717 66.1887V28.9327C71.6753 26.1583 69.2973 23.7803 66.5229 23.7803C64.9376 23.7803 63.3522 24.573 62.1632 26.1583Z" fill="black"/>
      </svg>
    ),
    color: '#000000',
    gradient: 'from-black to-gray-700',
  },
];

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const GamePage: React.FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoPair>(cryptoPairs[0]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(100);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<boolean | null>(null);

  // Enhanced bet handling with animations
  const handlePlaceBet = async (direction: 'up' | 'down') => {
    if (!betAmount || isNaN(Number(betAmount)) || Number(betAmount) <= 0) return;
    
    // Animate the bet placement
    const result = currentPrice + (Math.random() > 0.5 ? 1 : -1);
    const won = (direction === 'up' && result > currentPrice) || (direction === 'down' && result < currentPrice);
    
    // Show result animation
    setLastWin(won);
    if (won) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    const newBet: BetHistory = {
      timestamp: new Date().toLocaleTimeString(),
      amount: parseFloat(betAmount),
      direction,
      outcome: won ? 'Win' : 'Loss',
      profit: won ? parseFloat(betAmount) * 1.95 : -parseFloat(betAmount),
    };

    setBetHistory((prev) => [newBet, ...prev]);
    setBetAmount('');
    setSelectedAmount(null);
  };
  const fetchPrice = async () => {
    try {
      // Validate the selectedCrypto before making the request
      if (!selectedCrypto || !selectedCrypto.id) {
        console.error('SelectedCrypto is not defined or invalid.');
        return;
      }
  
      // Fetch data from CoinGecko API
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: selectedCrypto.id, // Use the crypto ID
          vs_currencies: 'usd', // Get price in USD
          include_24hr_change: 'true', // Include 24-hour change
        },
      });
  
      // Extract and update price and change data
      const price = response.data[selectedCrypto.id]?.usd; // Ensure valid response
      const change = response.data[selectedCrypto.id]?.usd_24h_change;
  
      if (price !== undefined && change !== undefined) {
        setCurrentPrice(price);
        setPriceChange(change);
  
        // Update the priceData array for the chart
        setPriceData((prev) => [
          ...prev.slice(-49), // Keep only the last 50 data points
          { timestamp: Date.now(), price },
        ]);
      } else {
        console.error('Invalid data received from API:', response.data);
      }
    } catch (error) {
      console.error('Error fetching live price:', error.message || error);
    }
  };
  useEffect(() => {
    fetchPrice(); // Initial fetch
    const interval = setInterval(fetchPrice, 2000); // Fetch every 2 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [selectedCrypto]); // Re-run fetchPrice when selectedCrypto changes
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);
    setUserInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Based on recent market trends, I suggest waiting for a clear breakout pattern before placing your next bet.' },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-6" style={{ backgroundImage: "url('/images/bg2.jpg')" }}>
            <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">

        <div className="lg:col-span-2 space-y-6">
          {/* Crypto Selector */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cryptoPairs.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto)}
                className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all transform hover:scale-105 ${selectedCrypto.id === crypto.id ? `bg-gradient-to-r ${crypto.gradient} text-white shadow-lg` : 'bg-white text-gray-800 hover:bg-gray-50'}`}
              >
                <crypto.icon />
                <span className="font-semibold">{crypto.name}</span>
              </button>
            ))}
          </div>

          {/* Price Display and Chart */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#FFE1A3] shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-baseline gap-6 mb-8">
                <div className="text-5xl font-extrabold text-white">{formatCurrency(currentPrice)}</div>
                <span className={`text-xl font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                  {priceChange >= 0 ? <ArrowUp className="w-6 h-6 mr-1" /> : <ArrowDown className="w-6 h-6 mr-1" />}
                  {Math.abs(priceChange).toFixed(2)}%
                </span>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 225, 163, 0.1)" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid #FFE1A3',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value) => [`${formatCurrency(value)}`, 'Price']}
                      labelFormatter={(ts) => new Date(ts).toLocaleString()}
                      cursor={{ stroke: '#FFE1A3', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={selectedCrypto.color} 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 8, fill: selectedCrypto.color, stroke: '#FFF', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Betting Controls */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter bet amount"
                    className="w-full bg-gray-100 text-gray-900 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67EFF]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 50, 100].map((amount) => (
                      <button key={amount} onClick={() => setBetAmount(amount.toString())} className="bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handlePlaceBet('up')} className="bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                    <div className="flex flex-col items-center gap-2">
                      <ArrowUp className="w-6 h-6" />
                      <span>Up</span>
                    </div>
                  </button>
                  <button onClick={() => handlePlaceBet('down')} className="bg-gradient-to-r from-red-400 to-red-500 p-4 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                    <div className="flex flex-col items-center gap-2">
                      <ArrowDown className="w-6 h-6" />
                      <span>Down</span>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Bet History */}
          <Card className="bg-white/90 backdrop-blur-sm border-[#FFE1A3] shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 animate-spin-slow" />
                <h3 className="text-xl font-bold">Recent Bets</h3>
              </div>
              <div className="space-y-2">
                {betHistory.slice(0, 5).map((bet, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02] ${
                      bet.outcome === 'Win'
                        ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'
                        : 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{bet.timestamp}</span>
                      <span className={`${
                        bet.profit >= 0 
                          ? 'text-green-600 animate-bounce-subtle' 
                          : 'text-red-600'
                      }`}>
                        {bet.profit >= 0 ? '+' : ''}{formatCurrency(bet.profit)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Bet {formatCurrency(bet.amount)} {bet.direction.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {isPaid ? (
            <Card className="bg-white border-[#FFE1A3] shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-xl font-bold">AI Assistant</h3>
                </div>
                <div className="h-96 flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-[#A67EFF]' : 'bg-gray-200'}`}>
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask for trading advice..."
                      className="flex-1 bg-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A67EFF]"
                    />
                    <button onClick={handleSendMessage} className="bg-[#A67EFF] p-3 rounded-lg text-white">
                      Send
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <button onClick={() => setShowModal(true)} className="w-full bg-gradient-to-r from-[#A67EFF] to-[#C9A8F7] p-4 rounded-lg font-bold text-white">
                Unlock AI Assistant (2 NEAR)
              </button>
              {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>
                    <p className="text-gray-700 mb-6">
                      Unlock AI Assistant for 2 NEAR. This will give you access to personalized trading insights.
                    </p>
                    <div className="flex gap-4">
                      <button onClick={() => { setIsPaid(true); setShowModal(false); }} className="flex-1 bg-[#A67EFF] py-3 rounded-lg font-semibold text-white">
                        Confirm
                      </button>
                      <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 py-3 rounded-lg font-semibold">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Stats Card */}
          <Card className="bg-white border-[#FFE1A3] shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#FDF1E7] to-[#FFE1A3] p-6 rounded-xl shadow-sm">
                  <div className="text-gray-600 text-sm font-medium mb-2">Win Rate</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {betHistory.length > 0
                      ? `${((betHistory.filter(bet => bet.outcome === 'Win').length / betHistory.length) * 100).toFixed(1)}%`
                      : '0%'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#F0FFF4] to-[#DCFCE7] p-6 rounded-xl shadow-sm">
                  <div className="text-gray-600 text-sm font-medium mb-2">Total Profit</div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(betHistory.reduce((acc, bet) => acc + bet.profit, 0))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-[#FDF1E7] p-4 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Best Win</span>
                    <span className="text-green-600 font-bold text-lg">
                      {formatCurrency(Math.max(0, ...betHistory.map(bet => bet.profit)))}
                    </span>
                  </div>
                </div>
                <div className="bg-[#FDF1E7] p-4 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Bets</span>
                    <span className="text-gray-900 font-bold text-lg">
                      {betHistory.length}
                    </span>
                  </div>
                </div>
                <div className="bg-[#FDF1E7] p-4 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Avg. Bet Size</span>
                    <span className="text-gray-900 font-bold text-lg">
                      {betHistory.length > 0
                        ? formatCurrency(betHistory.reduce((acc, bet) => acc + bet.amount, 0) / betHistory.length)
                        : '$0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-white border-[#FFE1A3] shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5" />
                <h3 className="text-xl font-bold">Leaderboard</h3>
              </div>
              <div className="space-y-3">
                {[
                  { user: 'CryptoKing', wins: 42, profit: 12580, avatar: '👑' },
                  { user: 'MoonTrader', wins: 38, profit: 9870, avatar: '🌙' },
                  { user: 'DiamondHands', wins: 35, profit: 8450, avatar: '💎' }
                ].map((player, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-[#FDF1E7] rounded-lg hover:bg-[#FFE1A3] transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center text-2xl bg-white rounded-full shadow-sm">
                      {player.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{player.user}</div>
                      <div className="text-sm text-gray-500">{player.wins} wins</div>
                    </div>
                    <div className="text-green-600 font-semibold">
                      +{formatCurrency(player.profit)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timer Card */}
          <Card className="bg-white border-[#FFE1A3] shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4">
                <Timer className="w-6 h-6 text-[#A67EFF]" />
                <div className="text-3xl font-bold text-gray-900">{countdown}s</div>
              </div>
              <div className="text-center text-gray-500 text-sm mt-2">
                Until next round
              </div>
            </CardContent>
          </Card>

          {/* Footer Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white border-[#FFE1A3] shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-gray-600 text-sm">Today's Volume</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(betHistory.reduce((acc, bet) => acc + Math.abs(bet.amount), 0))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#FFE1A3] shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-gray-600 text-sm">Active Users</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">247</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Notice */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Trading crypto assets involves significant risk and possible loss of capital.</p>
        <p>Please trade responsibly. Team Moraq</p>
      </div>
    </div>
  );
};

export default GamePage;
