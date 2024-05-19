import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


const adminRoutes = ["/dashboard"]
const userRoutes = ["/"]


export default async function roleGuardMiddleware(request: NextRequest){
    const path = request.nextUrl.pathname
    const isAdminRoute = adminRoutes.includes(path)
    const isUserRoute = userRoutes.includes(path)
}