
import { useInfoStore } from '@/app/_zustand/useInfoStore'
import { useWebSocketStore } from '@/app/_zustand/useWebSocketStore'
import React, { useEffect, useState } from 'react'

function CameraViewer() {
    const {uuid, userName, role} = useInfoStore()
    const {cameraQueue, isConnected, connect, send} = useWebSocketStore()
    const [activeCam, setActiveCam]= useState<ICameraInfo|undefined>()

    useEffect(()=>{
        connect(process.env.WS_URI!)
        return ()=>{}
    },[])

    useEffect(()=>{
        if(isConnected){
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
            send({
                event:"request-list-cameras"
            })
        }
    },[isConnected])

    useEffect(()=>{
        if(!activeCam && cameraQueue.length!==0){
            setActiveCam(cameraQueue[0])
        }
        if(activeCam && cameraQueue.length === 0){
            setActiveCam(undefined)
        }
    }, [activeCam, cameraQueue])

    function changeActiveCam(cam:ICameraInfo):void{
        setActiveCam(cam)
    }

    return (
        <main
            className='flex flex-wrap min-h-screen '
        >

        </main>
    )
}

export default CameraViewer