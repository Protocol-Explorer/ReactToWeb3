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
import crowdFundJson from "../../../smart_contracts/artifacts/contracts/CrowdFund.sol/CrowdFund.json";
import { addresses } from "../../constants/addresses"

export default function Campaigns() {
  const [param, setParam] = useState(1);
  const chainId = useChainId();
  const { data, isError, isLoading, error, refetch } = useReadContract({
    abi: crowdFundJson.abi,
    address: addresses[chainId].crowdFund,
    functionName: 'campaigns',
    args: [param],
  });
  
  return(
    <div className="flex flex-row justify-center">
      <Card className="w-[350px]">
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
          {data ? (<div><p>Creator {data.toString()}</p><p>Campaign {data.toString()}</p></div>) : <></>}
        </CardFooter>
      </Card>
    </div>
  )
}