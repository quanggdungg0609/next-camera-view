"use client"

import { useEffect, useState } from "react";
import { useWebSocketStore } from "../_zustand/useWebSocketStore";
import { useInfoStore } from "@/app/_zustand/useInfoStore";
import ActiveCamera from "./components/ActiveCamera";
import ListCamera from "./components/ListCamera";

// Only holds serverRuntimeConfig and publicRuntimeConfig


export default function CameraView() {

    let  {uuid, userName, role} = useInfoStore()
    const {cameraQueue, isConnected, connect, send, register} = useWebSocketStore()
    const [activeCam, setActiveCam]= useState<ICameraInfo | undefined>()


    

    useEffect(()=>{
        console.log(uuid)
        // connect(process.env.WS_URI!,"d865c217-0e59-4c74-96bf-fd0c65e3f0ea","quangdung","admin")
    
        return()=>{
            
        }
    },[])

    useEffect(()=>{
        if(isConnected){
            // register()
            // register
            // send({
            //     event:"user-connect",
            //     data:{
            //         uuid: uuid,
            //         username: userName,
            //         role: role
            //     }
            // })

            // request list camera connect
            // send({
            //     event:"request-list-cameras"
            // })
        }   

    },[isConnected])

    useEffect(()=>{
        if(!activeCam && cameraQueue.length!==0){
            setActiveCam(cameraQueue[0])
        }

        if(activeCam && cameraQueue.length === 0){
            setActiveCam(undefined)
        }



        
    },[cameraQueue])


    function changeActiveCam(cam:ICameraInfo):void{
        setActiveCam(cam)
    }



    return (
        <main 
            className="flex flex-wrap
                h-screen sm:min-h-auto md:min-h-screen lg:min-h-screen xl:min-h-screen
                
                bg-slate-200
            "
        >
            <div className="w-full lg:w-8/12 bg-blue-500 ">
                { activeCam != undefined ? <ActiveCamera activeCam={activeCam}/> :
                    <h1>
                        No Camera Connect
                    </h1>
                }
                {/* <h1>
                        No Camera Connect
                    </h1> */}
            </div>

            {/* Cameras section */}
            <div
                className="w-full lg:w-4/12 bg-slate-500 pt-5 px-3 overflow-auto" 
            >
                <ListCamera listCamera={cameraQueue} activeCamera={activeCam!} callback={changeActiveCam} />
            </div>
            
        </main>
    );
}





