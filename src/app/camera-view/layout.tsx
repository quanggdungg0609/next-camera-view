import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useWebSocketStore } from "../_zustand/useWebSocketStore";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Camera View",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    

    return (
            <>{children}</>
    );
}