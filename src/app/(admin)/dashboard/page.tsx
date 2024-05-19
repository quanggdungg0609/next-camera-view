import { RegisterRequest } from "@/app/_components/RegisterRequests/RegisterRequests";
import React from "react";

export default function CameraView() {
    return(
        <div
            className="flex flex-col p-8"
        >
            <RegisterRequest/>
        </div>
    )
}