"use client"
import { getMyInfo } from '@/app/_utils/requests'
import { useInfoStore } from '@/app/_zustand/useInfoStore'
import { useWebSocketStore } from '@/app/_zustand/useWebSocketStore'
import { Card } from 'antd'
import React, { useEffect } from 'react'

export default function CameraViewCard() {
    const {cameraQueue, isConnected, send, connect, register, isRegister,  uuid, userName, role} = useWebSocketStore()
    const appState = useInfoStore()
    useEffect(()=>{
        if (userName === "" && uuid === "" && role === ""){
            getMyInfo()
            .then((value)=>{
                if(value!.error){
                    console.log(value?.error)
                }
                
                appState.login(value!.userName, value!.email, value!.role)
            })
        }
        if(isConnected){
            send({
                event:"request-list-cameras"
            })
        }
    },[])

    useEffect(()=>{
        console.log(appState.uuid)
        if(appState.uuid !== "" && appState.userName !== "" && appState.role !== ""){
            connect(process.env.WS_URI!, appState.uuid, appState.userName, appState.role)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[appState.uuid, appState.userName, appState.role])

    useEffect(()=>{
        if(isConnected && isRegister){
            send({
                event:"request-list-cameras"
            })
        }
        if(isConnected && !isRegister){
            register()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isConnected, isRegister])
    

    useEffect(()=>{
        console.table(cameraQueue.length)
    },[cameraQueue])

    return (
        <Card>
            <Card.Meta
                title="Camera View"
                description={`Camera connected: ${cameraQueue.length}`}
            />
        </Card>
    )
}



