import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
  useNetwork,
} from "wagmi";
import * as ABI from "../ABIs/DCADaily.json";
import * as ERC20ABI from "../ABIs/ERC20.json";
import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("DAI");
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>("0x0");
  const [DCADailyAddress, setDCADailyAddress] = useState<`0x${string}`>("0x0");
  const { address } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    const tokenSymbol = chain?.id == 11155111 ? "UNI" : "DAI";
    setTokenSymbol(tokenSymbol);
    const tokenAddress =
      chain?.id == 11155111
        ? "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" // UNI
        : "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"; // DAI on arbitrum
    setTokenAddress(tokenAddress);
    const DCADailyAddress =
      chain?.id == 11155111
        ? "0xee935cAB33f24eCe82dF2B516da33C0ddE8353cC" // Sepolia DCADaily contract
        : "0x0"; // Arbitrum DCADaily contract
    setDCADailyAddress(DCADailyAddress);
  }, [chain]);

  // Sign Up
  const { config } = usePrepareContractWrite({
    address: DCADailyAddress,
    abi: ABI.abi,
    functionName: "signUp",
    args: [parseEther(amount)],
  });
  const { write: signUp } = useContractWrite(config);

  // Set allowance
  const { config: allowanceConfig } = usePrepareContractWrite({
    address: tokenAddress,
    abi: ERC20ABI.abi,
    functionName: "approve",
    args: [DCADailyAddress, parseEther(total)],
  });
  const { write: updateAllowance } = useContractWrite(allowanceConfig);

  // Read allowance
  const { data: allowance } = useContractRead({
    address: tokenAddress,
    abi: ERC20ABI.abi,
    functionName: "allowance",
    args: [address, DCADailyAddress],
  });

  const formatTokenAllowance = allowance
    ? formatEther(allowance as bigint).slice(0, 6)
    : "0";

  // Read allowance
  const { data: balance } = useContractRead({
    address: tokenAddress,
    abi: ERC20ABI.abi,
    functionName: "balanceOf",
    args: [address],
  });
  console.log(balance);
  const formatTokenBalance = balance
    ? formatEther(balance as bigint).slice(0, 6)
    : "0";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="p-4">
        <ConnectButton />
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Sell {tokenSymbol} for ETH</CardTitle>
            <CardDescription>Every 15 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <p>
                  Amount ({formatTokenBalance} {tokenSymbol})
                </p>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <p>
                  Allowance ({formatTokenAllowance} {tokenSymbol})
                </p>
                <Input
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <div className="flex gap-1">
              <Button disabled={!signUp} onClick={() => signUp?.()}>
                Start
              </Button>
              <Button
                disabled={!updateAllowance}
                onClick={() => updateAllowance?.()}
              >
                Set Allowance
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div />
    </main>
  );
}
