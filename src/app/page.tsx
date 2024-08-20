"use client";

import { createWallet, inAppWallet } from "thirdweb/wallets";
import { ConnectButton, ConnectEmbed, useActiveWallet } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { useEffect, useState } from "react";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;

const wallets = [
  inAppWallet(
    // built-in auth methods
    {
      auth: {
        options: ["email", "phone", "passkey", "google", "apple", "facebook"],
      },
    }
    // or bring your own auth endpoint
  ),
  createWallet("io.metamask"),
];

export default function App() {
  const [connected, setConnected] = useState("Disconnected");
  const wallet = useActiveWallet();
  const client = createThirdwebClient({ clientId: clientId });

  useEffect(() => {
    setConnected(
      wallet ? String(wallet.getAccount()!.address) : "Disconnected"
    );
  }, [wallet]);

  return (
    <div className="relative flex flex-col justify-center items-center h-screen">
      {!wallet && <ConnectEmbed client={client} wallets={wallets} />}
      <button
        className={`absolute top-0 right-0 p-8 ${
          wallet ? "hover:text-green-600" : ""
        }`}
        onClick={() => {
          if (wallet) wallet.disconnect();
        }}
      >
        {connected}
      </button>
    </div>
  );
}
