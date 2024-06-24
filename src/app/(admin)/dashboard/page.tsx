"use client"
import CameraViewCard from "@/app/_components/UI/CameraViewCard/CameraViewCard";
import ListeGaches from "@/app/_components/UI/ListeGaches/ListeGaches";
import MediaCard from "@/app/_components/UI/MediaCard/MediaCard";
import {  UnlockOutlined } from "@ant-design/icons";
import { FloatButton, Popover, Typography } from "antd";
import React, { useState } from "react";

export default function CameraView() {
    const [open, setOpen] = useState<boolean>(false)

    function handleOpenChange(newOpen: boolean){
        setOpen(newOpen)
    }
    return(
        <div
            className="flex flex-col p-8 gap-8 bg-slate-300"
        >
            <CameraViewCard/>
            {/* <RegisterRequest/>
            <ListUsers/> */}

            <MediaCard/>
            <Popover
                content={
                    <div
                        className="flex flex-col w-[280px] p-1 "
                    >
                        <ListeGaches/>
                    </div>
                }
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
                placement="right"
            >
                <FloatButton icon={<UnlockOutlined  />} type="primary" style={{ left:20, top:"50%" }} />
            </Popover>
        </div>
    )
}