import { NextRequest, NextResponse } from "next/server";
import AuthMidleware from "./authMiddleware";


export const middleware:((request: NextRequest) => Promise<NextResponse<unknown>>)[] = [AuthMidleware]