import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


const protectedRoutes = ["/camera-view"]
const publicRoutes = ["/"]



export default async function AuthMidleware(request: NextRequest): Promise<NextResponse>{
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)
    
    const cookiesStore = cookies()
    
    const haveAccessToken = cookiesStore.has("access")
    const haveRefreshToken = cookiesStore.has("refresh")

    const header = new Headers()
    if(isProtectedRoute && !haveRefreshToken){
        header.set("redirect","/")
        return NextResponse.next({
            request:{
                headers: header
            }
        })
        // redirect to public route
        // return NextResponse.redirect(new URL("/", request.nextUrl))
    }   


    if(isPublicRoute && haveRefreshToken){

    }
    

    return NextResponse.next()
}