import type { Metadata } from "next";
import AdminNavBar from "../_components/UI/AdminNavBar/AdminNavBar";


export const metadata: Metadata = {
    title: "Admin Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col w-screen">
            <AdminNavBar/>
                
            {children}
        </div>
    );
}