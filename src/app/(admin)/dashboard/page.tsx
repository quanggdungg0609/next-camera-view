"use client"
import CameraViewCard from "@/app/_components/UI/CameraViewCard/CameraViewCard";
import MediaCard from "@/app/_components/UI/MediaCard/MediaCard";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { FloatButton, Popover } from "antd";
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
                    <div>
                        Hello
                    </div>
                }
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
            >
                <FloatButton icon={<QuestionCircleOutlined />} type="primary" style={{ right: 24 }} />
            </Popover>
        </div>
    )
}