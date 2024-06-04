"use client"
import React, { useEffect } from 'react'

function VideosTab() {
    useEffect(()=>{
        console.log("Video tab mounted")
    },[])
    return (
        <div>VideosTab</div>
    )
}

export default VideosTab