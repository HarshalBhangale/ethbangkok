import Link from "next/link";

export default function GameCards() {
  return (
    <div className="container mx-auto grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-5 mt-10">
      
      {/* Prediction Arena Card */}
      <div className="relative bg-white/80 backdrop-blur-lg text-black rounded-3xl shadow-xl hover:shadow-2xl transform transition-all duration-500 p-8 text-center border border-transparent hover:border-green-400 glow-effect">
        <span className="absolute top-3 right-3 text-4xl animate-spin-slow">🎯</span>
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
          Prediction Arena
        </h2>
        <p className="mb-6 text-gray-700">Predict outcomes and win big. Show off your skills!</p>
        <Link href="/prediction">
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300">
            Play Now with $10 USDC
          </button>
        </Link>
      </div>

      {/* Pass Through Hole Card */}
      <div className="relative bg-white/80 backdrop-blur-lg text-black rounded-3xl shadow-xl hover:shadow-2xl transform transition-all duration-500 p-8 text-center border border-transparent hover:border-pink-400 pulse-effect">
        <span className="absolute top-3 right-3 text-4xl animate-bounce">🕳️</span>
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Pass Through Hole
        </h2>
        <p className="mb-6 text-gray-700">Navigate the challenge and claim your victory!</p>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300">
          Play Now with $10 USDC
        </button>
      </div>

      {/* PromptFi Card */}
      <div className="relative bg-white/80 backdrop-blur-lg text-black rounded-3xl shadow-xl hover:shadow-2xl transform transition-all duration-500 p-8 text-center border border-transparent hover:border-yellow-400 flicker-effect">
        <span className="absolute top-3 right-3 text-4xl animate-pulse">🤖</span>
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500">
          PromptFi
        </h2>
        <p className="mb-6 text-gray-700">Leverage AI-powered insights for profitable moves!</p>
        <button className="bg-gradient-to-r from-red-500 to-yellow-500 text-white px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300">
          Play Now with $10 USDC
        </button>
      </div>

    </div>
  );
}
