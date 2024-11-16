import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Trophy, Users, Coins } from "lucide-react";

export default function HolePage() {
  const [participants, setParticipants] = useState(42);
  const [prizePool, setPrizePool] = useState(1000);
  const [topPlayers, setTopPlayers] = useState([
    { rank: 1, name: "Player123", score: 2500 },
    { rank: 2, name: "CryptoKing", score: 2100 },
    { rank: 3, name: "BlockMaster", score: 1800 },
    { rank: 4, name: "LuckyWinner", score: 1600 },
    { rank: 5, name: "GamePro", score: 1400 },
  ]);

  return (
    <div
      className="min-h-screen bg-cover bg-center text-black py-10"
      style={{ backgroundImage: "url('/images/bg5.jpg')" }}
    >
      <Navbar />

      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Pass Through Hole Challenge
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Prize Pool */}
            <div className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 rounded-2xl p-6 backdrop-blur-sm border-2 border-yellow-300 shadow-lg hover:scale-105 hover:shadow-yellow-500/50 transition-transform animate-float">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-800 animate-bounce" />
                <h2 className="text-xl font-bold text-yellow-900">Prize Pool</h2>
              </div>
              <p className="text-4xl font-extrabold text-yellow-900 animate-glow">
                ${prizePool} USDC
              </p>
            </div>

            {/* Participants */}
            <div className="bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 rounded-2xl p-6 backdrop-blur-sm border-2 border-pink-300 shadow-lg hover:scale-105 hover:shadow-pink-500/50 transition-transform">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-pink-800 animate-bounce" />
                <h2 className="text-xl font-bold text-pink-900">Participants</h2>
              </div>
              <p className="text-4xl font-extrabold text-pink-900">{participants}</p>
            </div>

            {/* Your Score */}
            <div className="bg-gradient-to-b from-purple-300 via-purple-400 to-purple-500 rounded-2xl p-6 backdrop-blur-sm border-2 border-purple-300 shadow-lg hover:scale-105 hover:shadow-purple-500/50 transition-transform">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-6 h-6 text-purple-800 animate-bounce" />
                <h2 className="text-xl font-bold text-purple-900">Your Score</h2>
              </div>
              <p className="text-4xl font-extrabold text-purple-900">0</p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-black">
              Top Players
            </h2>
            <div className="space-y-4">
              {topPlayers.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-4 bg-gradient-to-r ${
                    player.rank === 1
                      ? "from-yellow-400/30 to-amber-500/30 hover:from-yellow-400/40 hover:to-amber-500/40 border-2 border-yellow-400"
                      : player.rank === 2
                      ? "from-slate-300/30 to-gray-400/30 hover:from-slate-300/40 hover:to-gray-400/40 border-2 border-slate-300"
                      : player.rank === 3
                      ? "from-amber-600/30 to-orange-700/30 hover:from-amber-600/40 hover:to-orange-700/40 border-2 border-amber-600"
                      : "from-white/10 to-gray-200/10 hover:from-white/20 hover:to-gray-200/20"
                  } rounded-xl backdrop-blur-sm shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-2xl font-extrabold ${
                        player.rank === 1
                          ? "text-yellow-400 animate-glow"
                          : player.rank === 2
                          ? "text-gray-300"
                          : player.rank === 3
                          ? "text-amber-600"
                          : "text-black"
                      }`}
                    >
                      #{player.rank}
                    </span>
                    <span className="font-semibold text-black">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-black">
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
