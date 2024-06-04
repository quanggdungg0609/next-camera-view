"use client"
import React, { useEffect } from 'react'

function ImagesTab() {

    useEffect(()=>{
        console.log("image tab mounted")
        return ()=>{
            console.log("image tab unmounted")
        }
    },[])
    return (
        <div
            className='h-auto'
        >
            
        </div>
    )
}

export default ImagesTab