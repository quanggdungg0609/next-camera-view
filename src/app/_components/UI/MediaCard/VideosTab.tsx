"use client"
import React, { useEffect, useRef, useState } from 'react'
import { TabsProps } from './type'
import { getListVideoNames, getListThumbnails, getListVideoInfos, getListVideoPreviews } from '@/app/_utils/requests'
import { InfoResponse, isInfoResponse, isResponsePagination } from '@/app/_types/response.type'
import { Card, Image, Pagination, Space, Typography } from 'antd'
import {formatBytes, formatDate} from "@/app/_utils/formatters"

import Meta from 'antd/es/card/Meta'
import { DownloadOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, UndoOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'

// TODO: Error message not implemented

type ListVideosType = Awaited<ReturnType<typeof getListVideoNames>>


function VideosTab(props:TabsProps): JSX.Element {
    const {cameraUuid}= props
    const cameraUuidRef = useRef<string>(cameraUuid)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [listVideoNames, setListVideoNames]= useState<Array<string>>([])
    const [listThumbs, setListThumbs] = useState<Array<string>>([])
    const [listVidInfos, setListVidInfos] = useState<Array<InfoResponse>>([])
    const [listLinkVids, setListLinkVids] = useState<Array<string>>([])

    const [isError, setIsError] = useState<boolean>(false)
    const [currentPage, setCurrentPage]= useState<number>(1)
    const [totalItems, setTotalItems] = useState<number>()

    useEffect(()=>{
        getListVideoNames(cameraUuidRef.current)
        .then((value:ListVideosType)=>{
            if(isResponsePagination(value)){
                setListVideoNames(value.list)
                setCurrentPage(value.page)
                setTotalItems(value.totalItem)
            }else{
                setIsError(true)
            }
        })
    },[])


    useEffect(()=>{
        const fetchData = async () =>{
            try{
                setIsLoading(true)
                const [resThumbnails, resInfos, resPreviews] = await Promise.all([
                    getListThumbnails(cameraUuidRef.current, listVideoNames),
                    getListVideoInfos(cameraUuidRef.current, listVideoNames),
                    getListVideoPreviews(cameraUuidRef.current, listVideoNames)
                ])

                if(Array.isArray(resThumbnails) && resThumbnails.every(val=>typeof val === "string")){
                    setListThumbs(resThumbnails)
                }

                if(Array.isArray(resInfos) && resInfos.every(val=> isInfoResponse(val))){
                    setListVidInfos(resInfos)
                }

                if(Array.isArray(resPreviews) && resPreviews.every(val=> typeof val === "string")){
                    setListLinkVids(resPreviews)
                }
                

            }finally{
                setIsLoading(false)
            }
        }

        
        if(listVideoNames.length !== 0){
            fetchData()
        }
    },[listVideoNames])

    async function handleChangePage(page:number){
        try{
            setIsLoading(true)
            const response = await getListVideoNames(cameraUuid, page)
            if(isResponsePagination(response)){
                setListVideoNames(response.list)
                setCurrentPage(response.page)
                setTotalItems(response.totalItem)
            }
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <div className='h-fit w-full'>
            <div className='flex flex-col gap-4 h-[600px] content-between'>
                {
                    isLoading?
                        <div
                            className='flex justify-center items-center h-full'
                        >
                            Loading...
                        </div>
                        :
                        <div
                            className='grid grid-cols-4 w-full gap-4 h-[600px]'
                        >
                            {
                                listThumbs.map((image,index)=>(
                                    <div key={`thumb-${index}`}
                                        className="w-full flex flex-grow-0 h-fit max-h-fit"
                                    >
                                        <Card
                                            className="w-full drop-shadow-md"
                                            cover={
                                                <Image
                                                    src={image}
                                                    alt={`Preview ${index}`}
                                                    preview={{
                                                        destroyOnClose:true,
                                                        imageRender: ()=>(
                                                            <video
                                                                muted
                                                                controls
                                                                preload='auto'
                                                                width="80%"
                                                                src={listLinkVids[index]}
                                                            />
                                                        ),
                                                        toolbarRender:(
                                                            _,
                                                            {
                                                                transform: { scale },
                                                                actions: {
                                                                    onFlipY,
                                                                    onFlipX,
                                                                    onRotateLeft,
                                                                    onRotateRight,
                                                                    onZoomOut,
                                                                    onZoomIn,
                                                                    
                                                                },
                                                            },
                                                        )=>(
                                                            <Space size={40} className="toolbar-wrapper">
                                                                <DownloadOutlined 
                                                                    style={{ fontSize: '24px' }}
                                                                    onClick={()=>{
                                                                        fetch(listLinkVids[index])
                                                                        .then((response) => response.blob())
                                                                        .then((blob) => {
                                                                            const url = URL.createObjectURL(new Blob([blob]));
                                                                            const link = document.createElement('a');
                                                                            link.href = url;
                                                                            link.download = listVidInfos[index].name;
                                                                            document.body.appendChild(link);
                                                                            link.click();
                                                                            URL.revokeObjectURL(url);
                                                                            link.remove();
                                                                    });}} 
                                                                />
                                                                <SwapOutlined style={{ fontSize: '24px' }} rotate={90} onClick={onFlipY} />
                                                                <SwapOutlined style={{ fontSize: '24px' }} onClick={onFlipX} />
                                                                <RotateLeftOutlined style={{ fontSize: '24px' }} onClick={onRotateLeft} />
                                                                <RotateRightOutlined style={{ fontSize: '24px' }} onClick={onRotateRight} />
                                                                <ZoomOutOutlined style={{ fontSize: '24px' }} disabled={scale === 1} onClick={onZoomOut} />
                                                                <ZoomInOutlined style={{ fontSize: '24px' }} disabled={scale === 50} onClick={onZoomIn} />
                                                            </Space>
                                                        )
                                                    }}
                                                />
                                            }

                                        >
                                            <Meta
                                                title={listVidInfos[index].name}
                                                description={
                                                    <div
                                                        className='flex flex-col'
                                                    >
                                                        <span>
                                                            <Typography.Text strong>Size:</Typography.Text>{` ${formatBytes(listVidInfos[index].size)}`}
                                                        </span>
                                                        <span>
                                                            <Typography.Text strong>Date:</Typography.Text>{` ${formatDate(listVidInfos[index].last_modified)}`}
                                                        </span>

                                                    </div>
                                                }
                                            />
                                        </Card>
                                    

                                    </div>

                                ))
                            }
                        
                        </div>
                }
                <div className='flex items-center justify-center'>
                        <Pagination simple current={currentPage} total={totalItems} pageSize={8}
                            onChange={(page)=>{
                                // handleChangePage(page)
                            }}
                        />
                </div>
            </div>
        </div>
    )
}

export default VideosTab

