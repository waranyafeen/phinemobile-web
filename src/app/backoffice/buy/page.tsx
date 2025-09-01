'use client';

import { useState } from "react";
import axios  from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";
import Modal from "@/app//backoffice/modal";

export default function Page() {

    const [isOpen, setIsOpen] = useState(false);
    const [serial, setSerial] = useState('');
    const [name, setName] = useState('');
    const [release, setRelease] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [remark, setRemark] = useState('');

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const handleSave = async () => {
        try{
            const payload = {
                serial: serial,
                name: name,
                release: release,
                color: color,
                price: price,
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                remark: remark
            }

            //ส่งค่าไปหลังบ้าน
            const res = await axios.post(`${config.apiUrl}/buy/create`, payload);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ',
                text: 'บันทึกเรียบร้อยแล้ว',
                timer: 2000
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้'
            });
        }
    }

    return (
        <div>
            <h1 className="content-header">รายการซื้อ</h1>
            <div>
                <button className="btn" onClick={handleOpenModal}>
                    <i className="fa-solid fa-plus mr-2"></i>เพิ่มรายการ
                </button> 
            </div>
            <Modal title="เพิ่มรายการ" isOpen={isOpen} onClose={handleCloseModal}>
                <div>serial สินค้า</div>
                <input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} />

                <div>ชื่อสินค้า</div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <div>รุ่น</div>
                <input type="text" value={release} onChange={(e) => setRelease(e.target.value)} />

                <div>สี</div>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />

                <div>ราคา</div>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />

                <div>ชื่อผู้ซื้อ</div>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

                <div>เบอร์โทรศัพท์ลูกค้า</div>
                <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />

                <div>ที่อยู่ลูกค้า</div>
                <input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />

                <div>หมายเหตุ</div>
                <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} />

                <div>
                    <button className="btn" onClick={handleSave}>
                        <i className="fa-solid fa-save mr-2"></i>บันทึก
                    </button>
                </div>
                
            </Modal>
        </div>
    )
};