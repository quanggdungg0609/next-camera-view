import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


const protectedRoutes = ["/dashboard"]
const publicRoutes = ["/"]



export default async function AuthMiddleware(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookiesStore = cookies();

    const haveAccessToken = cookiesStore.has("access");
    const haveRefreshToken = cookiesStore.has("refresh");

    if (isProtectedRoute && !haveRefreshToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if ((isPublicRoute && haveAccessToken) || (isPublicRoute && haveRefreshToken)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}