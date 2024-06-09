"use client"

import React from 'react'
import Image from "next/image"
import { Divider } from 'antd'
import {getOnetimeID, }  from "@/app/_utils/requests"
import { useInfoStore } from '@/app/_zustand/useInfoStore'
import { isResponseError } from '@/app/_types/response.type'
function AdminNavBar() {
    const {userName} = useInfoStore()
    
    
    return (
        <nav className="flex flex-row h-[100px] w-full bg-slate-600 items-center place-content-between px-5">
            <div className="flex flex-row items-center h-full relative gap-3 ">
                <Image
                    src={"/logo.png"}
                    alt="Logo"
                    width={80}
                    priority
                    height={80}
                />
                <h1
                    className="text-xl font-semibold line-clamp-2 text-neutral-50"
                >Admin Dashboard</h1>
            </div>
            <div className='flex flex-col items-end gap-4  p-2'>
                <h5 
                    className="text-lg font-semibold text-neutral-50"
                >
                    Welcome, {userName}
                </h5>
                <div
                    className='flex flex-row items-end gap-5 underline text-cyan-500 select-none'
                >
                    <h6
                        className='cursor-pointer'
                        onClick={async ()=> {
                                const response = await getOnetimeID()
                                if (response  && !isResponseError(response)){
                                    window.location.href = `${response.url}?id=${response.onetimeId}`
                                    console.log(response)
                                }
                            
                        }}
                    >
                        Admin Page
                    </h6>
                    <h6
                        className='cursor-pointer'

                    >
                        Logout
                    </h6>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavBar