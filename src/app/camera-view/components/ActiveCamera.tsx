import { useWebRTC } from "@/app/_hooks/useWebRTC";
import { useAppStore } from "@/app/_zustand/useAppStore";
import { useWebSocketStore } from "@/app/_zustand/useWebSocketStore";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";





export default function ActiveCamera(props:{activeCam: ICameraInfo}): ReactElement{
    const {uuid, location, name} = props.activeCam
    
    // * zustand stores
    const webSocket = useWebSocketStore()
    const appState = useAppStore()
    // * hooks
    const {createPeerConnection, addRemoteSD, closeConnection, stream, localSD} = useWebRTC()

    const [activeCamera, setActiveCamera] = useState<ICameraInfo>()

    // * refs
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(()=>{
        const webSocketSubcription = webSocket.subject.subscribe(async (message)=>{
            switch (message.event){
                case "answer-sd":
                    const  answerSd:RTCSessionDescription = new RTCSessionDescription(
                        {
                            type: message.data.type, 
                            sdp: message.data.sdp,
                        }
                    )
                    addRemoteSD(answerSd)
                    break
                default:
                    break
            }
        })

        setActiveCamera(props.activeCam)

        return ()=>{
            webSocketSubcription.unsubscribe()
        }
    },[])

    useEffect(()=>{
        if(activeCamera && activeCamera.uuid !== props.activeCam.uuid){
            closeConnection()
            setActiveCamera(props.activeCam)
        }
    },[props.activeCam])

    useEffect(()=>{
        if(stream && videoRef.current){
            videoRef.current.srcObject = stream
        } else if(!stream && videoRef.current){
            videoRef.current.srcObject= null
        }
    },[stream])

    useEffect(()=>{
        async function handleActiveStreamState(){
                await createPeerConnection()
        }
        if(activeCamera){
            handleActiveStreamState()
        }
    },[activeCamera])

    

    useEffect(()=>{
        if(localSD){
            webSocket.send({
                event:"offer-sd",
                data:{
                    uuid: appState.uuid,
                    to: uuid,
                        type: localSD?.type,
                        sdp: localSD?.sdp
                }
            })
        }
    },[localSD])
    
    

    return (
        <>
                <div
                    className="flex relative h-3/4 bg-white p-5 justify-center items-center"
                >
                    
                    <div className="w-full sm:aspect-video md:aspect-video md:h-full relative">
                        <video 
                            ref={videoRef} 
                            autoPlay={true} 
                            muted={true}
                            className="object-fill  h-full rounded-3xl shadow-2xl shadow-slate-400"
                        />
                    </div>
                    <div className="absolute top-10 right-10">
                        <h1 className="text-red-500 "> LIVE</h1>
                    </div>
                </div>
                {/* Info camera */}
                <div
                    className="flex w-full w- h-1/4 flex-row p-10"
                >
                    <div
                        className="w-1/2 h-full flex flex-col justify-center"
                    >
                        {<h1 className="text-2xl font-bold font-sans">{name}</h1>}
                        {<p>{location}</p>}
                    </div>

                    <div
                        className="w-1/2 h-full flex flex-wrap justify-end  items-center"
                    >
                        {/* { 
                            !activeStream ?
                                <button type="button" 
                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 
                                    focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm 
                                    px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    onClick={handleActiveStreamView}
                                >
                                    View
                                </button> :
                                <button type="button" 
                                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 
                                        focus:ring-4 focus:ring-red-300 font-medium rounded-lg 
                                        text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                        onClick={handleStopStreamView}
                                >
                                    Stop
                                </button>
                        
                        } */}
                    </div>
            </div>
        </>
    )
}