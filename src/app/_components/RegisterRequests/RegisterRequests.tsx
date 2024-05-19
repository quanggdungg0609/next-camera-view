"use client"
import { getRegisterRequests } from "@/app/_utils/server_function";
import { Card, Spin } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";




export function RegisterRequest(){
    // const router = useRouter()
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [requests, setRequests ] = useState<any[]>([])
    const [isError, setIsError] = useState<boolean>(false)

    useEffect(()=>{
        console.log("mounted")
        setIsLoading(true)
        getRegisterRequests()
        .then(value=>{
            if(value?.error === "An Error Occured")
            {
                setIsError(true)
            }
            setCurrentPage(value?.currentPage)
            setRequests(value?.currentPage)
        })
        .finally(() => {
            setIsLoading(false);
        });
    },[])



    return (
        <Card
            title="Register Requests"
            className = "w-full "
        >
            {isLoading ??
                <Spin tip="Loading" size="large">
                    Loading
                </Spin>
            }
        </Card>
    )

}