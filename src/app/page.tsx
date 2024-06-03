"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useReadContract } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {Claim, Campaigns, Refund, Launch, Pledges} from "../components/tabs";
import crowdFundJson from "../../smart_contracts/artifacts/contracts/CrowdFund.sol/CrowdFund.json";
import { addresses } from "../constants/addresses"

export default function Home() {
  const { open } = useWeb3Modal();
  const chainId = useChainId();
  const {data: campaignCount, isError, isFetched } = useReadContract({
    abi: crowdFundJson.abi,
    address: addresses[chainId].crowdFund,
    functionName: 'count'
  })

  const [activeTab, setActiveTab] = useState('Campaigns');

  const tabs = [
    { id: 'Campaigns', label: 'View Campaigns' },
    { id: 'Launch', label: 'Launch Campaign' },
    { id: 'Pledges', label: 'Pledges' },
    { id: 'Refund', label: 'Refund' },
    { id: 'Claim', label: 'Claim' },
  ];

  return (
    <main>
      <section className="py-12 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-bold">CrowdFund</h1>
        <p className="text-2xl text-muted-foreground">
          Total Campaigns Supported {campaignCount?.toString()}
        </p>
      </section>
      <div className="flex gap-6 items-center justify-center">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 text-center focus:outline-none ${
                  activeTab === tab.id
                    ? 'inline-block p-6 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'
                    : 'inline-block p-6 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {activeTab === 'Campaigns' && <Campaigns />}
        {activeTab === 'Launch' && <Launch />}
        {activeTab === 'Pledges' && <Pledges />}
        {activeTab === 'Refunds' && <Refund />}
        {activeTab === 'Claim' && <Claim />}
      </div>
    </main>
  );
}
