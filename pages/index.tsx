import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Cover from "../public/images/cover.png";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  return (
    <>
      <Head>
        <title>Lucky Masters | Join the Fun</title>
        <meta
          name="description"
          content="Where luck meets fun! Bet, play, and win with our exciting games."
        />
      </Head>
      <main
        className="flex min-h-screen min-w-full bg-cover bg-center flex-col items-center justify-center"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
      >
                <div className="text-center p-8 bg-black bg-opacity-50 rounded-lg shadow-2xl">
        {/* Image Component for Cover */}
        <div className="w-full max-w-4xl mb-6">
          <Image
            src={Cover}
            alt="Cover Image"
            className="rounded-lg shadow-xl"
            layout="responsive"
            priority
          />
        </div>

        {/* Text Content */}

          <h1 className="text-7xl font-luckiest text-yellow-400 mb-6">
            Royale Master
          </h1>
          <p className="text-2xl font-semibold text-white mb-10">
            Where luck meets fun! Bet, play, and win with our exciting games.
          </p>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 py-4 px-12 text-black text-xl font-bold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            onClick={login}
          >
            Join the Fun
          </button>
        </div>
      </main>
    </>
  );
}
