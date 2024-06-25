import { NextRequest, NextResponse } from 'next/server';
import AuthMiddleware from './middlewares/authMiddleware'; // Đường dẫn đúng tới AuthMiddleware của bạn

export async function middleware(request: NextRequest) {
    const response = await AuthMiddleware(request);

    if (response.headers.get('Location')) {
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ],
};



