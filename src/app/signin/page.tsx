'use client';

import { useState } from "react";
import { config } from "../config";
import axios from "axios";
import Swal from "sweetalert2"
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const route = useRouter();

    const handleSignIn = async () => {
        try {
            console.log(username, password);
            const payload = {
                username: username,
                password: password
            }
            const response = await axios.post(`${config.apiUrl}/user/signin`, payload)
            
            if (response.data.token !== null) {
                localStorage.setItem('token', response.data.token) //เก็บ token ไว้หลังบ้านให้ token มา
                route.push('/backoffice/dashboard');
            }else { //แต่ถ้ากรอกข้อมูลผิดก็จะแสดง
                Swal.fire({
                    icon: 'warning',
                    title: 'ตรวจสอบ user',
                    text: 'ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง',
                    timer: 2000
                })
            }
        }catch(error: any) {
            if (error.response.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ตรวจสอบ user',
                    text: 'ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง',
                    timer: 2000
                })
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                })
            }
        }
    }

    return ( 
        <div className="signin-container">
            <div className="signin-box">
                <h1 className="text-2xl font-bold">Sign In</h1>
                <div className="mt-4">Username</div>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <div className="mt-4">Password</div>
                <input 
                    type="text" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button 
                    className="mt-4"
                    onClick={handleSignIn} 
                >Sign In
                </button>
            </div>
        </div>
    );
}