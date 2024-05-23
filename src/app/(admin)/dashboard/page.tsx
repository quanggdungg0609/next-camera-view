import CameraViewCard from "@/app/_components/UI/CameraViewCard/CameraViewCard";
import ListUsers from "@/app/_components/UI/ListUsers/ListUsers";
import { RegisterRequest } from "@/app/_components/UI/RegisterRequests";
import React from "react";

export default function CameraView() {
    return(
        <div
            className="flex flex-col p-8 gap-8 bg-slate-300"
        >
            <CameraViewCard/>
            <RegisterRequest/>
            <ListUsers/>
        </div>
    )
}