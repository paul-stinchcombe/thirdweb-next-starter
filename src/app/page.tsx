"use client";

import { createWallet, inAppWallet } from "thirdweb/wallets";
import {
  ConnectButton,
  ConnectEmbed,
  MediaRenderer,
  useActiveWallet,
} from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { useEffect, useState } from "react";
import { SkaleCalypsoHubTestnet } from "@thirdweb-dev/chains";
import { useOwnedNFTs, useContract, useAddress } from "@thirdweb-dev/react";

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
  // createWallet("io.metamask"),
];

export default function App() {
  const [connected, setConnected] = useState("Disconnected");
  const wallet = useActiveWallet();
  const client = createThirdwebClient({ clientId: clientId });

  useEffect(() => {
    setConnected(
      wallet ? String(wallet.getAccount()!.address) : "Disconnected"
    );

    if (wallet) {
      // const address = wallet?.getAccount()?.address;
      // const { contract } = useContract(contractAddress);
      // const { data, isLoading, error } = useOwnedNFTs(contract, address);
      //
      //   wallet
      //     .getAccount()!
      //     .sendTransaction({
      //       chainId: wallet.getChain()!.id,
      //       to: wallet.getAccount()!.address,
      //       value: BigInt(0),
      //     })
      //     .then((result) => {
      //       console.log(result);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
    }
  }, [wallet]);

  const chain = {
    ...base,
    id: SkaleCalypsoHubTestnet.chainId,
    name: SkaleCalypsoHubTestnet.name,
    rpc: SkaleCalypsoHubTestnet.rpc[0],
    icon: SkaleCalypsoHubTestnet.icon,
    blockExplorers: SkaleCalypsoHubTestnet.explorers.map((e) => ({
      name: e.name,
      url: e.url,
    })),
    nativeCurrency: SkaleCalypsoHubTestnet.nativeCurrency,
  };

  return (
    <div className="relative flex flex-col justify-center items-center h-screen">
      {!wallet && (
        <ConnectEmbed client={client} chain={chain} wallets={wallets} />
      )}
      <button
        className={`absolute top-0 right-0 p-8 ${
          wallet ? "hover:text-green-600" : "cursor-default"
        }`}
        onClick={() => {
          if (wallet) wallet.disconnect();
        }}
      >
        {connected}
        {wallet && (
          <div className="absolute top-10 right-0 p-8 hover:text-red-600">
            <div className="flex gap-10 justify-end items-center text-yellow-500">
              {wallet.getChain()?.name}
              {wallet.getChain()?.icon?.url && (
                <MediaRenderer
                  client={client}
                  src={wallet.getChain()?.icon?.url}
                  className={`w-9`}
                />
              )}
            </div>
          </div>
        )}
      </button>

      {wallet && <img src="/kami-logo.png" className="w-96" />}
    </div>
  );
}
