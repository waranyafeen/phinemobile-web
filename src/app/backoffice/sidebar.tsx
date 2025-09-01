import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="bg-teal-500 h-screen w-72">
            <div className="bg-teal-700 text-white p-5 text-xl">
                <h1>phineMobile Version 1.0</h1>
            </div>

            <div className="flex flex-col gap-3 text-white text-xl p-5">
                <div>
                    <Link href="/backoffice/dashboard">
                        <i className="fa fa-tachometer-alt mr-2 w-[25px] text-center"></i>
                        Dashboard
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/buy">
                        <i className="fa fa-shopping-cart mr-2 w-[25px] text-center"></i>
                        ซื้อสินค้า
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/sell">
                        <i className="fa fa-dollar-sign mr-2 w-[25px] text-center"></i>
                        ขายสินค้า
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/repair">
                        <i className="fa fa-tools mr-2 w-[25px] text-center"></i>
                        รับซ่อมสินค้า
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/company">
                        <i className="fa fa-building mr-2 w-[25px] text-center"></i>
                        ข้อมูลร้าน
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/user">
                        <i className="fa fa-user mr-2 w-[25px] text-center"></i>
                        ข้อมูลผู้ใช้งานระบบ
                    </Link>
                </div>
            </div>
        </div>
    );
}
