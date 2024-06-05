"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  useChainId,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import { crowdFundABI, tokenABI } from "@/constants";
import { addresses } from "../../constants/addresses";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseEther } from "viem";

export default function Pledges() {
  const chainId = useChainId();
  const account = useAccount();

  const { data: approvalAmount} = useReadContract({
    abi: tokenABI,
    address: addresses[chainId].reactToWebToken,
    functionName: 'allowance',
    args: [account.address, addresses[chainId].crowdFund]
  });

  const { data: hash, writeContract, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });
  
  const FormSchema = z.object({
    campaignId: z.number({
      required_error: "A fundraising goal is required",
      coerce: true,
    }), 
    amount: z.number({
      required_error: "A fundraising goal is required",
      coerce: true,
    }), 
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function pledges(data: { amount: number; campaignId: number; }) {
    writeContract({
      address: addresses[chainId].crowdFund,
      abi: crowdFundABI,
      functionName: "pledge",
      args: [
        BigInt(data.campaignId),
        BigInt(data.amount)
      ],
    });
  }

  async function submit(data: z.infer<typeof FormSchema>) {
    const approvalLimit = BigInt(approvalAmount as string)
    const amount = parseEther(data.amount.toString())
    
    if (approvalLimit < amount) {
      writeContract({
        address: addresses[chainId].reactToWebToken,
        abi: tokenABI,
        functionName: "approve",
        args: [
          addresses[chainId].crowdFund,
          amount
        ],
      });
    } else {
      pledges(data);
    }  

  }
  
  useEffect(() => {
    if (isConfirming) {
      toast.loading("Transaction Pending");
    }
    if (isConfirmed) {
      toast.dismiss()
      toast.success("Transaction Successful", {
        action: {
          label: "View on Block Explorer",
          onClick: () => {
            window.open(`https://sepolia.etherscan.io/tx/${hash}`);
          },
        },
      });
    }
    if (error) {
      toast.error("Transaction Failed");
    }
  }, [isConfirming, isConfirmed, error, hash]);
  return (
    <div className="flex flex-row justify-center">
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Pledge</CardTitle>
          <CardDescription>
            Enter a campaign ID and amount you'd like to pledge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="campaignId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Goal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-1.5">
                  <Button className="mt-6">Submit</Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isError && <p>Error occurred, {error.message}</p>}
        </CardFooter>
      </Card>
    </div>
  );

  
}
