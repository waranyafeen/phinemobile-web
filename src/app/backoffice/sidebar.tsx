

export default function Sidebar() {
    return (
        <div className="bg-teal-500 h-screen w-72">
            <div className="bg-teal-700 text-white p-5 text-xl">
                <h1>phineMobile Version 1.0</h1>
            </div>

            <div className="flex flex-col gap-3 text-white text-xl p-5">
                <div>Dashboard</div>
                <div>Company</div>
                <div>User</div>
            </div>
        </div>
    );
}
