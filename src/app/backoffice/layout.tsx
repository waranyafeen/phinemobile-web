import Sidebar from "./sidebar"

export default function BackOfficeLayout({ children }: { 
    children: React.ReactNode 
}) {
    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-5 bg-teal-100 h-screen ml-72">
                <div className="bg-white p-5 rounded-lg shadow-lg shadow-teal-400 overflow-auto ">
                    {children}
                </div>
            </div>
        </div>
    )       
}
