import Sidebar from "./sidebar"

export default function BackOfficeLayout({ children }: { 
    children: React.ReactNode 
}) {
    return (
        <div className="flex">
            <Sidebar/>
            <main className="flex-1 p-5">
                {children}
            </main>
        </div>
    )       
}
