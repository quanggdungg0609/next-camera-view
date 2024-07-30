import { useWebRTC } from '@/app/_hooks/useWebRTC'
import { useInfoStore } from '@/app/_zustand/useInfoStore'
import { useWebSocketStore } from '@/app/_zustand/useWebSocketStore'
import React, { ReactElement, useEffect, useRef, useState } from 'react'

function MiniActiveCam(props:{activeCam: ICameraInfo}):ReactElement {
    const {uuid, location, name} = props.activeCam

    const webSocketStore = useWebSocketStore()
    const infoStore = useInfoStore()

    const {createPeerConnection, addRemoteSD, closeConnection, stream, localSD} = useWebRTC()

    const [activeCam, setActiveCam] = useState<ICameraInfo>()

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(()=>{
        const webSocketSubcription = webSocketStore.subject.subscribe(
            async (message)=>{
                switch(message.event){
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
            }
        )
        setActiveCam(props.activeCam)

        return ()=>{
            webSocketSubcription.unsubscribe()
        }
    },[])


    useEffect(()=>{

        if(stream && videoRef.current){
            
            videoRef.current.srcObject = stream

            videoRef.current.play()
        }else if(!stream && videoRef.current){
            videoRef.current.srcObject=null
        }
    },[stream])

    useEffect(()=>{
        async function handleActiveStreamState(){
            await createPeerConnection()
        }
        if(activeCam){
            handleActiveStreamState()
        }
    },[activeCam])

    useEffect(()=>{
        if(localSD){
            webSocketStore.send({
                event:"offer-sd",
                data:{
                    uuid: infoStore.uuid,
                    to: uuid,
                        type: localSD?.type,
                        sdp: localSD?.sdp
                }
            })
        }
    },[localSD])

    return (
            
                <video
                    ref={videoRef}
                    autoPlay={true}
                    muted={true}
                    playsInline
                    className='object-fill w-full rounded-lg drop-shadow-md'
                />
            
    )
}

export default MiniActiveCam