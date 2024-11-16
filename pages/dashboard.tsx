import Link from "next/link";
import Navbar from "@/components/navbar";
import GameCards from "@/components/GameCards";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-600 to-blue-500 text-white py-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg3.jpg')" }}>
      <Navbar />

      <div className="container mx-auto px-5 text-center mt-20">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
          Step into the arena of endless possibilities. Are you ready to play?
        </h1>
      </div>
      
      <GameCards />

    </div>
  );
};

export default Dashboard;