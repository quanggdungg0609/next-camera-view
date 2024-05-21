"use client"

import React from 'react'
import Image from "next/image"
import { Avatar, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
function AdminNavBar() {
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
            <div className='flex '>
                <Avatar
                    style={{
                        backgroundColor: '#87d068',
                    }}
                    shape="square" size={64} icon={<UserOutlined />} />

            </div>
        </nav>
    )
}

export default AdminNavBar