"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from "next/navigation";
import { Card, Empty, Result, Table, Tag } from 'antd';
import { getListUsers } from "@/app/_utils/requests"
import { ExclamationCircleOutlined } from '@ant-design/icons';


export default function ListUsers() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [listUsers, setListUsers] = useState<any[]>([])
    const totalItems = useRef<number>()

    const columns =[
        {
            title:  "Username",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title:"Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text: any) => text ? text : <p className='text-slate-400'>{"None"}</p>,
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            render: (text: any) => text ? text : <p className='text-slate-400'>{"None"}</p> ,
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
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (_: any, { role }: any) =>{

                return(
                    <Tag color={role === "admin" ? "blue" : "green"}>
                            {role}
                    </Tag>
                )
            }
        }
    ]

    useEffect(()=>{
        setIsLoading(true)
        getListUsers()
        .then((value)=>{
            if(value?.error === "Session Expired"){
                router.push("/")
                return
            }
            if(value?.error === "An Error Occured")
            {
                    setIsError(true)
                    return
            }
            totalItems.current = value!.totalItems
            setListUsers(value?.listUsers)
        })
        .finally(()=>{
            setIsLoading(false)
        })


    },[])

    async function handleTableChange (newPagination:any){
        try{
            setIsLoading(true)
            const response = await getListUsers(newPagination.current, newPagination.pageSize)
            if(response?.error){
                setIsError(true)
            }
            if(response?.listUsers){
                setListUsers(response?.listUsers)
                setCurrentPage(newPagination.current)
                setIsLoading(false)
            }
        }catch(exception){
            setIsError(true)
        }
    };

    return (
        <Card
            title="List Users"
            className = "w-full"
        >
            <Table
                columns={columns}
                dataSource={listUsers}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: 5,
                    total: totalItems.current
                }}
                loading={isLoading}
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
            >

            </Table>
        </Card>
    )
}
