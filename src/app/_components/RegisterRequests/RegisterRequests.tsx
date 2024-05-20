"use client"
import { getRegisterRequests } from "@/app/_utils/requests";
import { Card, Divider, Empty, Spin } from "antd";
import Meta from "antd/es/card/Meta";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";



export function RegisterRequest(){
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [requests, setRequests ] = useState<any[]>([])
    const [isError, setIsError] = useState<boolean>(false)
    // const totalPages = useRef<number>()
    // const totalItems = useRef<number>()

    useEffect(()=>{
        console.log("mounted")
        setIsLoading(true)
        getRegisterRequests()
        .then(value=>{
            if(value?.error === "Session Expired"){
                router.push("/")
            }
            if(value?.error === "An Error Occured")
            {
                setIsError(true)
            }
            setCurrentPage(value?.currentPage)
            setRequests(value?.registerRequests)
            // totalPages.current= value!.totalPages
            // totalItems.current= value!.totalItems
        })
        .finally(() => {
            setIsLoading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        console.table(requests)
    },[requests])
    async function getRequests(pageNumber: number){

    }





    return (
        <Card
            title="Register Requests"
            className = "w-full max-h-[400px]"
        >
            {isLoading ??
                <Spin tip="Loading" size="large">
                    Loading
                </Spin>
            }
            {
                // (totalItems.current === 0 || !totalItems.current) ?? <Empty/>
            }
            <div
                className="footer-register-request
                flex flex-row w-full h-[50px]
                "
            >
                <div
                    className="flex flex-row"
                >
                    {/* <p>{currentPage} / {totalPages.current}</p> */}
                </div>
            </div>
        </Card>
    )

}


interface RequestProps{
    requests: any[]
}


function Requests(props: RequestProps){
}