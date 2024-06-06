"use client"
import React, { useEffect, useRef, useState } from 'react'
import { TabsProps } from './type'
import { getListVideoNames, getListThumbnails, getListVideoInfos } from '@/app/_utils/requests'
import { InfoResponse, isInfoResponse, isResponsePagination } from '@/app/_types/response.type'



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
                const [resThumbnails, resInfos] = await Promise.all([
                    getListThumbnails(cameraUuidRef.current, listVideoNames),
                    getListVideoInfos(cameraUuidRef.current, listVideoNames),
                ])

                if(Array.isArray(resThumbnails) && resThumbnails.every(val=>typeof val === "string")){
                    console.log(resThumbnails)
                    setListThumbs(resThumbnails)
                }
                
                if(Array.isArray(resInfos) && resInfos.every(val=> isInfoResponse(val))){
                    setListVidInfos(resInfos)
                }
                

            }finally{
                setIsLoading(false)
            }
        }

        
        if(listVideoNames.length !== 0){
            fetchData()
        }
    },[listVideoNames])

    return (
        <div>VideosTab</div>
    )
}

export default VideosTab