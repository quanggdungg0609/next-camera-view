import CameraViewCard from "@/app/_components/UI/CameraViewCard/CameraViewCard";
import MediaCard from "@/app/_components/UI/MediaCard/MediaCard";
import React from "react";

export default function CameraView() {
    return(
        <div
            className="flex flex-col p-8 gap-8 bg-slate-300"
        >
            <CameraViewCard/>
            {/* <RegisterRequest/>
            <ListUsers/> */}

            <MediaCard/>
        </div>
    )
}