"use client"


import { useEffect, useState } from "react";
import { useWebSocketStore, WSEvent } from "../zustand/useWebSocketStore";
import { useAppStore } from "../zustand/useAppStore";
import ActiveCamera from "./components/ActiveCamera";

interface InfoCam{
    name: string
    location: string,
    uuid: string,
}




export default function CameraView() {
    const appState = useAppStore()
    const webSocket = useWebSocketStore()
    const [activeCam, setActiveCam]= useState<CameraType | undefined>()
    const [cameras, setCameras] = useState(new Map<string,CameraType>())
    


    async function handleMessageEvent(message: WSEvent) {
        switch(message.event){
            case "camera-connect":
                if(!activeCam && cameras.size === 0){
                    setActiveCam((prevState)=>{
                        const newCam: CameraType={
                            uuid: message.data.uuid as string,
                            name: message.data.name as string,
                            location: message.data.location as string
                        }
                        return newCam
                    })
                }else{
                    setCameras((prevState)=>{
                            const newCam: CameraType={
                                uuid: message.data.uuid as string,
                                name: message.data.name as string,
                                location: message.data.location as string
                            }
                            const newState = new Map(prevState)
                            newState.set(message.data.uuid as string,newCam )
        
                            return newState
                        })
                }
                break
            case "camera-disconnect":
                const disconnectCam = message.data.uuid

                if (activeCam?.uuid === disconnectCam){
                    setActiveCam(undefined)
                }

                setCameras((prevState)=>{
                    const newState = new Map(prevState)
                    newState.delete(message.data.uuid)
                    return newState;
                })
                break
            
            case "response-list-cameras":
                const listCamera: CameraType[] = message.data
                if (listCamera.length == 1){
                    setActiveCam(listCamera[0])
                } else if(activeCam == undefined && listCamera.length > 1){
                    setActiveCam(listCamera[0])
                    setCameras((prevState)=>{
                        const newState = new Map(prevState)
                        listCamera.forEach((camera)=>{
                            newState.set(camera.uuid, camera)
                        })
                        return newState
                    })
                } else if (activeCam != undefined && listCamera.length > 1){
                    setCameras((prevState)=>{
                        const newState = new Map(prevState)
                        listCamera.forEach((camera)=>{
                            newState.set(camera.uuid, camera)
                        })
                        return newState
                    })
                }
                break

            case "offer-sd":
                break

            default:
                break
        }
    }

    useEffect(()=>{
        if(activeCam!= undefined){
        }
    },[activeCam])

    useEffect(()=>{
        appState.login("quangdung", "quangdung0609@gmail.com", "admin")
        webSocket.connect("ws://0.0.0.0:3030/")
        const subcription = webSocket.subject.subscribe((message)=>{
            handleMessageEvent(message)
        })

        return()=>{
            subcription.unsubscribe()
        }
    },[])

    useEffect(()=>{
        if(webSocket.isConnected){
            // register
            webSocket.send({
                event:"user-connect",
                data:{
                    uuid: appState.uuid,
                    username: appState.userName,
                    role: appState.role
                }
            })

            // request list camera connect
            webSocket.send({
                event:"request-list-cameras"
            })
        }
        

    },[webSocket.isConnected, appState])

    return (
        <main 
            className="flex flex-wrap
                h-screen sm:min-h-auto md:min-h-screen lg:min-h-screen xl:min-h-screen
                
                bg-slate-200
            "
        >
            <div className="w-full lg:w-3/4 bg-blue-500 ">
                { activeCam != undefined ? <ActiveCamera activeCam={activeCam}/> :
                    <h1>
                        No Camera Connect
                    </h1>
                }
            </div>

            {/* Cameras section */}
            <div
                className="w-full lg:w-1/4 bg-slate-500 p-5" 
            >
                List Cameras
                {Array.from(cameras.keys()).map((uuidCam)=>{
                    const camera = cameras.get(uuidCam)
                    return <div key={uuidCam}>
                        {camera?.name}
                        {camera?.location}
                    </div>
                })}
            </div>
            
        </main>
    );
}





