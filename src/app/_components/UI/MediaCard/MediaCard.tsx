"use client"

import { AutoComplete, Card, Empty, Flex, Select, Tabs } from 'antd'
import React, { Children, useEffect, useState } from 'react'
import ImagesTab from './ImagesTab'
import VideosTab from './VideosTab'

import {getListCameraMedia} from "@/app/_utils/requests"


type CameraOption = {
    value: string;
    label: JSX.Element;
    name: string;
}

function MediaCard() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [listCameras, setListCameras] = useState<Array<{name: string, uuid:string}>>([])
    const [selectedCamera, setSelectedCamera]= useState<{name:string, uuid: string}>()
    const tabs = selectedCamera ? [
        {
            label: `Images`,
            key: `image-tab`,
            children: <ImagesTab cameraUuid={selectedCamera.uuid} />
        },
        {
            label: `Videos`,
            key: `video-tab`,
            children: <VideosTab cameraUuid={selectedCamera.uuid}/>
        }
    ] : [];

    useEffect(()=>{
        setIsLoading(true)
        getListCameraMedia().then(value=>{
            console.log(value)
            if (!value.error){
                if (Array.isArray(value.cameras)){
                    setListCameras(value.cameras)
                    setIsLoading(false)
                }
            }else{
                setIsError(true)
                setIsLoading(false)
            }
        })

    },[])

    useEffect(()=>{
        console.log(selectedCamera)
    },[selectedCamera])
    return (
        <Card
            title="Media"
            className='flex flex-col'
        >
                <div
                    className='flex flex-row mb-4 items-center gap-2'
                >
                    <p>CAMERA:</p>
                    <Select
                        className='w-60'
                        placeholder="Select camera..."
                        loading={isLoading}
                        options={listCameras.map(camera=>{
                            return {
                                value: camera.uuid,
                                label:<span>{camera.name}</span>,
                                name: camera.name
                            }
                        })}
                        onChange={(value, options)=>{
                            const selectedOption = options as CameraOption;
                            setSelectedCamera({
                                name: selectedOption.name,
                                uuid: value
                            })
                            
                        }}
                    />
            

                </div>
                {selectedCamera?<Tabs
                    key={selectedCamera.uuid}
                    className=' mt-4'
                    type="card"
                    size="large"
                    items={tabs}
                />:
                <div className='flex w-full min-h-[400px] h-4/5  max-h-[400px] justify-center items-center'>
                    <Empty description="No Camera Selected"/>
                </div>
                }
        </Card>
    )
}

export default MediaCard