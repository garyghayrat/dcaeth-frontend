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
import { usePrepareContractWrite, useContractWrite } from "wagmi";

const inter = Inter({ subsets: ["latin"] });
const DCADailyAddress = "0x0";

export default function Home() {
  const { config } = usePrepareContractWrite({
    address: DCADailyAddress,
    abi: [
      {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
      },
    ],
    functionName: "mint",
  });

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <ConnectButton />
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Decide recurring buy amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <p>Recurring Amount</p>
                <Input />
              </div>
              <div className="flex flex-col space-y-1.5">
                <p>Total Amount</p>
                <Input />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button>Sign Up</Button>
          </CardFooter>
        </Card>
      </div>
      <div />
    </main>
  );
}
