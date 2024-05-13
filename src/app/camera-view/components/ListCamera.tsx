import Image from "next/image"
import {useEffect, useState} from "react"


interface ListCameraProps{
    listCamera: ICameraInfo[]
    activeCamera: ICameraInfo
    callback: (camera:ICameraInfo )=> void
}


export default function ListCamera(props:ListCameraProps){
    const {listCamera, activeCamera, callback} = props

    return (<>
        <h1 className="text-2xl pb-4 ">List Cameras</h1>
        {listCamera.map((item)=>{
            if(activeCamera){
                // if(activeCamera.uuid !== item.uuid){
                    return (
                        <div key={item.uuid}
                            className="flex flex-row border p-2 lg:h-1/6 gap-2"
                            onClick={()=>{
                                callback(item)
                            }}
                        >
                            <div className="w-1/3 h-full relative">
                                <Image
                                // ! placeholder image. should remove later
                                    src="/placeholder.jpg"
                                    fill={true}
                                    alt={`thumbnail-${item.uuid}`}
                                />
                            </div>
                            <div className="w-2/3  flex flex-col">
                                <h2 className="text-xl font-semibold ">
                                    {item.name}
                                </h2>
                                <h2 className="text-md text-ellipsis line-clamp-2">
                                    {item.location}
                                </h2>
                            </div>
                        </div>
                    )
                // }
            }
        })}
    </>)
}