"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useChainId, useReadContract } from "wagmi"
import { crowdFundABI } from "@/constants";
import { addresses } from "../../constants/addresses"
import { formatEther, parseEther } from "viem"
import { dateToUnixTime, unixTimeToDate} from "@/lib/utils"

export default function Campaigns() {
  const [param, setParam] = useState(0);
  const chainId = useChainId();
  const { data, isError, isLoading, error, refetch } = useReadContract({
    abi: crowdFundABI,
    address: addresses[chainId].crowdFund,
    functionName: 'campaigns',
    args: [param],
  });

  const campaignData = (data:any) => data?.toString().split(",");
  
  return(
    <div className="flex flex-row justify-center">
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>Campaign</CardTitle>
          <CardDescription>Enter a camapign ID to learn more</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="campaign">Campaign ID</Label>
                <Input id="campaign" value={param} type="number" placeholder="Campaign ID" onChange={(e) => setParam(Number(e.target.value))} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error occurred, {error.message}</p>}
          {data ? (
            <div>
              <p>Creator: {campaignData(data)[0]}</p>
              <p>Goal: {formatEther(campaignData(data)[1])}</p>
              <p>Pledged: {formatEther(campaignData(data)[2])}</p>
              <p>Start Time: {unixTimeToDate(campaignData(data)[3])}</p>
              <p>End Time: {unixTimeToDate(campaignData(data)[4])}</p>
              <p>Claimed: {campaignData(data)[5]}</p>
            </div>
          ) : <></>}
        </CardFooter>
      </Card>
    </div>
  )
}