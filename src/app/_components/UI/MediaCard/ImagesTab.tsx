"use client"
import React, { useEffect, useRef, useState } from 'react'
import { getListImageInfos, getListImageNames, getListPreviewImages } from '@/app/_utils/requests'
import { InfoResponse, isResponsePagination } from '@/app/_types/response.type'
import { Button, Card, Image, Pagination, Skeleton, Typography } from 'antd'
import Meta from 'antd/es/card/Meta'
import { TabsProps } from './type'
import {formatBytes, formatDate} from "@/app/_utils/formatters"


// TODO: Error message not implemented


type ListImageType = Awaited<ReturnType<typeof getListImageNames>>


function ImagesTab(props:TabsProps):JSX.Element {
    const {cameraUuid} = props
    const cameraUuidRef = useRef<string>(cameraUuid)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [listImageNames, setListImageNames] = useState<Array<string>>([])
    
    const [listPreviewImages, setListPreviewImages] = useState<Array<string>>([])
    const [listImageInfos, setListImageInfos]= useState<Array<InfoResponse>>([])
    const [isError, setIsError] = useState<boolean>(false)
    const [currentPage, setCurrentPage]= useState<number>(1)
    const [totalItems, setTotalItems] = useState<number>()
    useEffect(()=>{
        getListImageNames(cameraUuid).then((value: ListImageType)=>{
            if(isResponsePagination(value)){
                setListImageNames(value.list)
                setCurrentPage(value.page)
                setTotalItems(value.totalItem)
            }else{
                
            }
        })
        return ()=>{
            // console.log("image tab unmounted")
        }
    },[])

    useEffect(()=>{
        const fetchData = async()=>{
            setIsLoading(true)
            try{
                const [resPreviews, resInfos] = await Promise.all([
                    getListPreviewImages(cameraUuidRef.current, listImageNames),
                    getListImageInfos(cameraUuidRef.current, listImageNames),
                ])
                if(Array.isArray(resPreviews) && resPreviews.every(item=> typeof item ==="string")){
                    setListPreviewImages(resPreviews)
                }else{
                    setIsError(true)
                }

                if(Array.isArray(resInfos)){
                    setListImageInfos(resInfos)
                }
            }catch(exception){
                setIsError(true);
            }finally{
                setIsLoading(false)
            }
        }
        if(listImageNames.length!==0){
            fetchData();
        }
    },[listImageNames])

    async function handleChangePage(page: number){
        try{
            setIsLoading(true)
            const response = await getListImageNames(cameraUuid, page)
            if(isResponsePagination(response)){
                setListImageNames(response.list)
                setCurrentPage(response.page)
                setTotalItems(response.totalItem)
            }
        }finally{
            setIsLoading(false)
        }
    }

    async function handleReload() {
        setIsLoading(true);
        try {
            const response = await getListImageNames(cameraUuid, currentPage);
            if (isResponsePagination(response)) {
                setListImageNames(response.list);
                setCurrentPage(response.page);
                setTotalItems(response.totalItem);
            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div
            className='h-fit w-full'
        >
            <div className='flex flex-col gap-4 content-between '>
                {isLoading ? (
                    <div
                        className='flex justify-center items-center h-full'
                    >
                        Loading...
                    </div>
                ) : (
                    <div className='flex flex-col gap-3'>
                        <Button onClick={handleReload} disabled={isLoading}>Reload</Button>

                        <div className="grid  grid-row-1 md:grid-cols-4 w-full gap-4">
                            {listPreviewImages.map((image, index) => (
                                <div key={index} className="w-full flex flex-grow-0 h-fit max-h-fit">
                                    <Card
                                        className='w-full drop-shadow-md'
                                        cover={

                                            <Image
                                                src={image}
                                                alt={`Preview ${index}`}
                                                preview={true}
                                                // onLoad={()=>{console.log(`${index} loaded`)}}
                                            />
                                        }
                                    >
                                        <Meta title={listImageInfos[index].name}
                                            description={
                                                <div className='flex flex-col'>
                                                    <span><Typography.Text strong>Size:</Typography.Text>{` ${formatBytes(listImageInfos[index].size)}`}</span>
                                                    <span><Typography.Text strong>Date:</Typography.Text>{` ${formatDate(listImageInfos[index].last_modified)}`}</span>
                                                </div>
                                            }
                                        />

                                    </Card>

                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className='flex items-center justify-center'>
                        <Pagination simple current={currentPage} total={totalItems} pageSize={8}
                            onChange={(page)=>{
                                handleChangePage(page)
                            }}
                        />
                </div>
            </div>
            
        </div>
    )
}

export default ImagesTab