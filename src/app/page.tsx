"use client"
import { BrowserView, MobileView } from "react-device-detect";
import { Button, Card} from "antd"
import { useState } from "react";
import FormLogin from "./_components/Form/FormLogin/FormLogin";
import FormRegister from "./_components/Form/FormRegister/FormRegister";
// import "antd/lib/select/style/index.css";



// TODO: Implement register feature
export default function Home() {
  const [isReg, setIsReg] = useState<Boolean>(false)

  function switchIsReg(){
    setIsReg(!isReg)
  }

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
              title={isReg? "Register" : "Login"}
              className="w-full shadow-lg"
              bordered={true}
            >
              {
                !isReg ?
                <FormLogin/>
                : <FormRegister switchToLogin={switchIsReg}/>
              }
              <div 
                className="flex w-full justify-end"
              >
                <Button 
                  type="link"
                  onClick={()=>{
                    switchIsReg()
                  }}
                >
                  {isReg ? "Login":"Register"}
                </Button>
              </div>
            </Card>
        </BrowserView>
        <MobileView>
          testing mobile
        </MobileView>

      </main>
  );
}
