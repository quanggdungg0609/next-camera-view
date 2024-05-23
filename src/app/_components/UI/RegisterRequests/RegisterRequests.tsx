"use client"
import { approveRegisterRequest, getRegisterRequests } from "@/app/_utils/requests";
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Result, Empty } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";


export function RegisterRequest(){
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [requests, setRequests ] = useState<any[]>([])
    const [isError, setIsError] = useState<boolean>(false)
    const totalItems = useRef<number>()

    const columns =[
        {
            title:"Username",
            dataIndex: "userName",
            key: "userName",
            render: (text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined)=> <b>{text}</b>
        },
        {
            title:"Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Register At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string | number | Date)=>{
                const date = new Date(text)
                const year = date.getFullYear();
                const month = date.getMonth() + 1; 
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();
                return (
                    `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
                )
            }
            
        },
        {
            title: "Approve",
            key:"action",
            render: (text: any, record: { _id: any; }) => (
                <Space size="middle">
                    <Button 
                        icon={<CheckOutlined />} 
                        onClick={async () => await handleApproveRequest(record._id, true)} 
                        style={{
                            background:"#A1DD70",
                            borderColor: "#A1DD70",
                            color:"white"
                        }}
                    />
                    <Button 
                        icon={<CloseOutlined />}
                        onClick={async () => await handleApproveRequest(record._id, false)} 
                        style={{
                            background:"#EE4E4E",
                            borderColor: "#EE4E4E",
                            color:"white"
                        }}
                    />
                </Space>
            ),
        }
    ]


    useEffect(()=>{
        setIsLoading(true)
        getRegisterRequests()
        .then(value=>{
            if(value?.error === "Session Expired"){
                router.push("/")
                return
            }
            if(value?.error === "An Error Occured")
            {
                setIsError(true)
                return
            }
            setRequests(value?.registerRequests)
            totalItems.current= value!.totalItems
            return 
        })
        .finally(() => {
            setIsLoading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    

    async function handleApproveRequest(idRequest: string, isApprove: boolean){
        try{
            const response = await approveRegisterRequest(idRequest, isApprove)
            if(response.message){
                // if request success reload the table
                setIsLoading(true)
                    const res = await getRegisterRequests(currentPage)
                    if(res?.error){
                        setIsError(true)
                    }else{
                        if(res?.registerRequests.length === 0 && res.prevPage !== null){
                            const prevPageRes = await getRegisterRequests(parseInt(res?.prevPage))
                            if(prevPageRes?.error){
                                setIsError(true)
                            }
                            setRequests(prevPageRes?.registerRequests)
                            setCurrentPage(res?.currentPage - 1)
                        }else{
                            setRequests(res?.registerRequests)
                        }
                        totalItems.current = res?.totalItems 
                        setIsLoading(false)
                    }
            }
        }catch(exception){
            console.error(exception)
        }
    }

    async function handleTableChange (newPagination:any){
        try{
            setIsLoading(true)
            const response = await getRegisterRequests(newPagination.current, newPagination.pageSize)
            if(response?.error){
                setIsError(true)
            }
            if(response?.registerRequests){
                setRequests(response?.registerRequests)
                setCurrentPage(newPagination.current)
                setIsLoading(false)
            }
        }catch(exception){
            setIsError(true)
        }
    };

    return (
        <Card
            title="Register Requests"
            className = "w-full"
        >
            
            <Table 
                columns={columns} 
                dataSource={requests} 
                loading={isLoading}
                pagination={{
                    current: currentPage,
                    pageSize: 5,
                    total: totalItems.current
                }}
                rowKey="_id"
                onChange={handleTableChange}
                locale={{
                    emptyText: isError ? (
                        <Result
                            icon={<ExclamationCircleOutlined />}
                            title="Error"
                            subTitle="Failed to fetch data. Please try again later."
                        />
                    ) : (
                        <Empty/>
                    ),
                }}
            />
        </Card>
    )

}