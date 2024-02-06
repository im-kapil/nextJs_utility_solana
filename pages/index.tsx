import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

import {
  Keypair,
  Transaction,
  Connection,
  PublicKey,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { publicKey, disconnect, sendTransaction } = useWallet();
  console.log("🚀 ~ Home ~ publicKey:", publicKey);
  const [iswallet, setIswallet] = useState(false);

  const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  const renderWalletLogin = () => {
    return (
      <div>
        Browser Wallet:
        <WalletMultiButton
          style={{
            borderRadius: "50px",
            background: "#130b46",
            width: "240px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Manrope",
          }}
        />
      </div>
    );
  };

  const transferSPLtoken = async () => {
    try {
      const TOKEN_DECIMAL = 9;
      const USDCAddress = "41fMjoW1G7uYUE5283cMmGVPMat2yx4EmEMZEVaTFUhm";

      const connection = new Connection(
        "https://solana-devnet.g.alchemy.com/v2/2Om9vVrMNswSL0zrm_xLCUnLqJbqKYtW",
        "confirmed"
      );

      const recipient = "CnJwPXgr8LkywNbYiRBPpd9ZPsooawcyh98CAKw1KSPK";

      const senderTokenAccountAddress = await getAssociatedTokenAddress(
        new PublicKey(USDCAddress),
        publicKey!
      );
      console.log(
        "senderTokenAccountAddress::::",
        senderTokenAccountAddress.toString()
      );

      //  <Component/>
      // use.context and use memo (Read about it);

      const recipientTokenAccountAddress = await getAssociatedTokenAddress(
        new PublicKey(USDCAddress),
        new PublicKey(recipient)
      );
      console.log(
        "RecepientTokenAccountAddress:::",
        recipientTokenAccountAddress.toString()
      );

      const instruction = createTransferCheckedInstruction(
        senderTokenAccountAddress,
        new PublicKey(USDCAddress),
        recipientTokenAccountAddress,
        publicKey!,
        1 ** 9,
        TOKEN_DECIMAL // Replace with the decimals of the token
      );
      console.log("instruction:::", instruction);

      const transaction = new Transaction().add(instruction);
      const blockHash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;
      console.log("recentBlockHash:::", blockHash);
      transaction.recentBlockhash = blockHash;

      const txHash = await sendTransaction(transaction, connection);

      console.log("Hash:::", txHash);
    } catch (error) {
      console.log("🚀 ~ transferSPLtoken ~ error:", error);
    }
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {iswallet && renderWalletLogin()}
      <button onClick={() => setIswallet(true)}>connect</button>
      <button onClick={() => transferSPLtoken()}>send</button>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">pages/index.tsx</code>
        </p>
      </div>
    </main>
  );
}
