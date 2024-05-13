import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'
import { middleware as activatedMiddleware } from './middlewares/config'




export async function middleware(request: NextRequest) {
    // Initialize a NextResponse object
    const nextResponse = NextResponse.next()

    // Map through activated middleware functions
    const middlewareFunctions = activatedMiddleware.map(fn => fn(request));
    
     // Array to store middleware headers
    const middlewareHeader = [];

    // Loop through middleware functions
    for(const middleware of middlewareFunctions){
        // Execute middleware function and await the result
        const result = await middleware;

        // Check if the result is not okay and return it
        if (!result.ok) {
            return result;
        }
         // Push middleware headers to the array
        middlewareHeader.push(result.headers);
    }

    //First we are going to define a redirectTo variable
    let redirectTo = null;
    // Check each header in middlewareHeader
    middlewareHeader.some((header) => {
    // Look for the 'x-middleware-request-redirect' header
    const redirect = header.get('x-middleware-request-redirect');
    
    if (redirect) {
        // If a redirect is found, store the value and break the loop
        redirectTo = redirect;
        return true; // Break the loop
    }
        // Continue to the next header in case the redirect header is not found
        return false; // Continue the loop
    });

    // If a redirection is required based on the middleware headers
    if (redirectTo) {
    // Perform the redirection
        return NextResponse.redirect(new URL(redirectTo, request.url), {
            status: 307, // Use the appropriate HTTP status code for the redirect
        });
    }

    // If no redirection is needed, proceed to the next middleware or route handler
    return nextResponse;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher:[
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ],
}