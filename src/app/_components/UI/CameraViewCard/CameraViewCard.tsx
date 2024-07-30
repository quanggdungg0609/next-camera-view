"use client"
import { getMyInfo } from '@/app/_utils/requests'
import { useInfoStore } from '@/app/_zustand/useInfoStore'
import { useWebSocketStore } from '@/app/_zustand/useWebSocketStore'
import { Button, Card, Empty, Select, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import MiniActiveCam from '../MiniActiveCam/MiniActiveCam'
import { CameraOutlined } from '@ant-design/icons'



export default function CameraViewCard() {
    const {cameraQueue, isConnected, send, connect,  uuid, userName, role} = useWebSocketStore()
    const infoState = useInfoStore()
    const [activeCam, setActiveCam] = useState<ICameraInfo|undefined>()
    const [isRecord, setIsRecord] = useState<boolean>(false)

    useEffect(()=>{
        if (userName === "" && uuid === "" && role === ""){
            getMyInfo()
            .then((value)=>{
                if(value!.error){
                    console.log(value?.error)
                }
                infoState.login(value!.username, value!.email, value!.role)
            })
        }
        if(isConnected){
            send({
                event:"request-list-cameras"
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        if(infoState.uuid !== "" && infoState.userName !== "" && infoState.role !== ""){
            connect(`${process.env.WS_URI!}/ws/user/${infoState.userName}/${infoState.uuid}/`, infoState.uuid, infoState.userName, infoState.role)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[infoState.uuid, infoState.userName, infoState.role])

    useEffect(()=>{
        
        if(isConnected){
            send({
                event:"request-list-cameras"
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isConnected])
    


    useEffect(()=>{
        if(!activeCam && cameraQueue.length!==0){
            setActiveCam(cameraQueue[0])
        }

        if(activeCam && cameraQueue.length === 0){
            setActiveCam(undefined)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[cameraQueue])


    function handleRecord(){
        if(!isRecord){
            send({
                event:"start-record",
                data:{
                    from:uuid,
                    to: activeCam!.uuid
                }
            })
        }else{
            send({
                event:"stop-record",
                data:{
                    from:uuid,
                    to:activeCam!.uuid
                }
            })
        }
        setIsRecord(!isRecord)
    }

    function handleTakeImage(){
        send({
            event:"take-image",
            data:{
                from:uuid,
                to: activeCam!.uuid
            }
        })
    }

    return (
        <Card
            className='p-10'
        >
            {!activeCam &&
                <Card.Meta
                    title="Camera View"
                />
            }
            <div
                className='flex flex-col md:flex-row w-full justify-center items-stretch gap-2 md:gap-4 relative'
            >
                
                {
                    activeCam !== undefined?
                    <>
                        <div
                            className='relative  w-full md:w-3/4'
                        >
                            <MiniActiveCam activeCam={activeCam}/> 
                        </div>
                        <div 
                            className='grow flex flex-col place-content-between'
                        >
                            <div
                                className='flex flex-col'
                            >
                                <div
                                    className='bg-slate-400 p-2 rounded-lg'
                                >
                                    <Typography.Title level={3}>
                                        {activeCam.name}
                                    </Typography.Title>
                                    <Typography.Text
                                        type='secondary'
                                    >
                                        {
                                            activeCam.location.split('-').map((item, index, arr) => (
                                                <React.Fragment key={index}>
                                                    {item.trim()}
                                                    {index !== arr.length - 1 && <br />}
                                                </React.Fragment>
                                            ))
                                        }
                                    </Typography.Text>
                                </div>
                                <div
                                    className='flex mt-6 gap-3 w-full'
                                >
                                    <Button type="primary" icon={<CameraOutlined />} iconPosition='end' className='w-1/2'
                                        onClick={()=>{handleTakeImage()}}
                                    >
                                        Take Image    
                                    </Button>
                                    <Button type="primary" icon={<CameraOutlined />} iconPosition='end' danger={isRecord}
                                        onClick={()=>handleRecord()} className='w-1/2 grow'
                                    >
                                        {isRecord ? "Stop Record": "Record Video"}
                                    </Button>
                                </div>
                            </div>
                            <div
                                className='flex flex-col items-end gap-1'
                            >
                                {/* List camera section */}
                                <Typography.Text type="success">
                                    Camera Online: {cameraQueue.length}
                                </Typography.Text>
                                <Select
                                    className='w-full'
                                    defaultValue={0}
                                    onChange={(value: number)=>{
                                        setActiveCam(cameraQueue[value])
                                    }}

                                    options={cameraQueue.map((camera:ICameraInfo, index: number)=>{
                                        return {
                                            value:index,
                                            label: <span>{camera.name}</span>
                                        }
                                    })}
                                >
                                </Select>
                            </div>
                        </div>
                    </>
                    : 
                    <Empty
                        description="No Camera Connected"
                    />
                }
            </div>
        </Card>
    )
}



