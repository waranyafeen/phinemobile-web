'use client';

import { useEffect, useState } from "react";
import  axios  from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";

export default function Page() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [taxCode, setTaxCode] = useState("");

    //ไว้สำหรับให้หน้าบ้านดึงข้อมูลบริษัทมาแสดง
    //useEffect จะทำงานเมื่อเปิดหน้าจอขึ้นมา จากนั้นก็จะเรียกใช้ฟังก์ชัน fetchData fatchData ก็จะอ่านจาก api มาให้
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async() => {
        const res = await axios.get(`${config.apiUrl}/company/list`);
        setName(res.data.name);
        setAddress(res.data.address);
        setPhone(res.data.phone);
        setEmail(res.data.email);
        setTaxCode(res.data.taxCode);
    };

    const handleSave = async() => {
        try {
            const payload = {
                name: name,
                address: address,
                phone: phone,
                email: email,
                taxCode: taxCode
            }
            await axios.post(`${config.apiUrl}/company/create`, payload);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลเรียบร้อย',
                timer: 2000,
            });
        }catch(error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้',
            });
        }
    };

    return (
        <div>
            <h1 className="content-header">ข้อมูลร้าน</h1>
            <div>
                <div className="mt-4">ชื่อร้าน</div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <div className="mt-4">ที่อยู่</div>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            
                <div className="mt-4">เบอร์โทรศัพท์</div>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

                <div className="mt-4">อีเมล</div>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
         
                <div className="mt-4">รหัสประจำตัวผู้เสียภาษี</div>
                <input type="text" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} />
            </div>
            <button className="mt-4 btn" onClick={handleSave}><i className="fas fa-save mr-2"></i>บันทึก</button>
        </div>
    );
}
