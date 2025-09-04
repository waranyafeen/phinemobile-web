'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { config } from "@/app/config";
import Modal from "./modal";
import { error } from "console";


export default function Sidebar() {

    const [name, setName] = useState('');
    const [level, setLevel] = useState('');
    const router = useRouter();
    const [isShow, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        const token = localStorage.getItem('token'); 
        //ดึง token จาก localStorage ไปหลังบ้าน
        const header = {
            'Authorization': `Bearer ${token}`
        }
        const res = await axios.get(`${config.apiUrl}/user/info`, {
            headers: header
        });
        setName(res.data.name);
        setLevel(res.data.level);
        setUsername(res.data.username);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    }

    const handleSave = async () => {
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'รห้สผ่านไม่ตรงกัน',
                text: 'กรูณาตรวจสอบรหัสผ่านอีกครั้ง'
            });
            return;
        }

        //save data
        const payload = {
            name: name,
            username: username,
            password: password,
            level: level
        }

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`
        }

        await axios.put(`${config.apiUrl}/user/update`, payload, {
            headers: headers
        });

        fetchData();
        handleCloseModal();
    }

    return (
        <div className="bg-teal-500 h-screen w-72 fixed">
            <div className="bg-teal-700 text-white p-5 ">
                <h1 className="text-xl font-bold">phineMobile Version 1.0</h1>
                <div className="flex items-center gap-2 mt-3">
                    <i className="fa fa-user mr-2 text-center"></i>
                    <span className="w-full">{name} : {level}</span>
                    <button className="bg-blue-500 rounded-full px-2 py-1" onClick={handleShowModal}>
                        <i className="fa fa-pencil"></i>
                    </button>
                    <button 
                        className="bg-red-500 rounded-full px-2 py-1"
                        onClick={handleLogout}
                    >
                        <i className="fa fa-sign-out-alt"></i>
                    </button>
                </div>
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
            <Modal title="แก้ไขข้อมูลผู้ใช้งาน" isOpen={isShow} onClose={handleCloseModal}> 
                <div>
                    <div>ชื่อผู้ใช้งาน</div>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                    />

                    <div className="mt-3">Username</div>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        className="form-control"
                    />

                    <div className="mt-3">Password</div>
                    <input 
                        type="text" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        className="form-control"
                    />

                    <div className="mt-3">Confirm Password</div>
                    <input 
                        type="text" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="form-control"
                    />

                    <div className="mt-3">
                        <button className="btn" onClick={handleSave}>
                            <i className="fa fa-save mr-2"></i>
                            บันทึก
                        </button>
                    </div>

                </div>
            </Modal>
        </div>
    );
}
