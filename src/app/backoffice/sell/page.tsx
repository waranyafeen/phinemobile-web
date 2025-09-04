'use client';

import { useEffect, useState } from "react";
import axios  from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";
import Modal from "@/app//backoffice/modal";

export default function sellPage() {

    const [serial, setSerial] = useState('');
    const [price, setPrice] = useState(0);
    const [sells, setSells] = useState([]); //ข้อมูลทั้งหมด
    const [id, setId] = useState(0); //ข้อมูล id เอาไว้แก้ไชหรือลบรายการ
    const [totalAmount, settotalAmount] = useState(0);

    const handleSave = async () => {
        try {
            const payload = {
                serial: serial,
                price: price
            }
            await axios.post(`${config.apiUrl}/sell/create`, payload);
            fetchData();
        } catch(error: any) {
            if (error.response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่พบข้อมูลรายการสินค้า',
                    text: 'ไม่พบข้อมูลรายการสินค้า หรือ ไม่มีในสต็อก'
                });
            } else { 
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: error.message
                });
            }
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/sell/list`);
            setSells(res.data);

            let total = 0;
            for (let i = 0; i < res.data.length; i++) {
                total += res.data[i].price
            };
            settotalAmount(total);
        } catch (error: any) {
            Swal.fire({ 
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message 
            });
        }
    }

    useEffect(()=> {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const button = await Swal.fire({
                icon: 'question',
                text: 'ลบรายการนี้หรือไม่',
                title: 'คุณต้องการลบรายการนี้หรือไม่',
                showCancelButton: true,
                showConfirmButton: true
            });
            
            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/sell/remove/${id}`);
                fetchData();
            }  
        } catch(error: any) {
            Swal.fire({ 
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message 
            });
        }
    }

    const handleConfirm = async () => {
        try {
            const button = await Swal.fire({
                icon: 'question',
                title: 'ยืนยันการขาย',
                text: 'ยืนยันการขายหรือไม่',
                showConfirmButton: true,
                showCancelButton: true
            });

            if(button.isConfirmed){ 
                await axios.get(`${config.apiUrl}/sell/confirm`);
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.message 
            });

        }
    }

    return (
        <div>
            <div className="content-header">ขายสินค้า</div>
            <div className="flex gap-2 items-end">
                <div className="w-full">
                    <div>serial</div>
                    <input                         
                        type="text" 
                        onChange={(e) => setSerial(e.target.value)}
                        placeholder="Serial" 
                    />
                </div>

                <div className="text-right">
                    <div>ราคา</div>
                    <input 
                        className="text-right"
                        type="number" 
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="ราคา" 
                    />
                </div>
                <div>
                    <button className="btn flex items-center" onClick={handleSave}>
                    <i className="fa-solid fa-save mr-2"></i>บันทึก
                </button>
                </div>
            </div>
    
            <table className="table mt-5">
                <thead>
                    <tr>
                        <th className="text-left">serial</th>
                        <th className="text-left">รายการสินค้า</th>
                        <th className="text-right pr-0">ราคา</th>
                        <th className="w-[50px]"></th>
                    </tr>
                </thead>
                <tbody>
                    {sells.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.product.serial}</td>
                            <td>{item.product.name}</td>
                            <td className="text-right">{item.price.toLocaleString()}</td>
                            <td className="text-center">
                                <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                    <i className="fa-solid fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {sells.length > 0 && ( //ถ้ามีข้อมูลการขายถึงจะแสดงยอดรวมทั้งหมด //sell > 0 และ true ให้ทำสิ่งต่อไปนี้ () 
                <>
                    <div className="mt-5 flex justify-between">
                        <div>ยอดรวมทั้งหมด</div>
                        <div className="text-right font-bold bg-gray-200 px-4 py-2 rounded-lg">{totalAmount.toLocaleString()}</div>
                    </div>
                    <div className="mt-5 text-center">
                        <button className="btn" onClick={handleConfirm}>
                            <i className="fa-solid fa-check mr-2"></i>ยืนยันการขาย
                        </button>
                    </div>
                </>
            )}
            
        
        </div>
    )
};