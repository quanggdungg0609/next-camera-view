"use client"
import { BrowserView, MobileView } from "react-device-detect";
import { Card} from "antd"
import { useState } from "react";
import FormLogin from "./components/FormLogin/FormLogin";
// import "antd/lib/select/style/index.css";



// TODO: Implement register feature
export default function Home() {
  const [isReg, setIsReg] = useState<Boolean>(false)
  return (
      <main 
        className="flex justify-center items-center
        h-screen w-screen
        p-8
        bg-cyan-300"
      >
        <BrowserView className="flex 
          min-w-[300px] w-1/3 h-2/3  justify-center items-center"
        >
            <Card
              title="Login"
              className="w-full shadow-lg"
              bordered={true}
            >
              {
                !isReg ?
                <FormLogin/>
                :"Regsiter"
              }
              <div 
                className="flex w-full justify-end"
              >
                Register
              </div>
            </Card>
        </BrowserView>
        <MobileView>
          testing mobile
        </MobileView>

      </main>
  );
}
