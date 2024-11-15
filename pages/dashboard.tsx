import { useRouter } from "next/router";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import Game from '../components/game';

const DashboardPage = () => {
  const router = useRouter();
  const { ready, authenticated, logout } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <>
      <Head>
        <title>Privy Auth Demo - Dashboard</title>
      </Head>
      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        {ready && authenticated && (
          <>
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-semibold">Privy Auth Demo - Dashboard</h1>
              <button onClick={logout} className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700">
                Logout
              </button>
            </div>
            <div className="mt-6">
              <Game />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default DashboardPage;