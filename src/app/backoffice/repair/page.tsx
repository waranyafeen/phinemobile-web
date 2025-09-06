'use client';

import { useEffect, useState } from "react";
import axios  from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";
import Modal from "@/app//backoffice/modal";
import dayjs from "dayjs";

export default function Page() {

    const [isShow, setIsShow] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [remark, setRemark] = useState('');
    const [id, setId] = useState('');
    const [repairs, setRepairs] = useState([]);

    const handleOpenModal = () => {
        setIsShow(true);
    }

    const handleCloseModal = () => {
        setIsShow(false);
    }

    const handleSave = async () => {
        try {
            const payload = {
                name: name,
                price: price,
                remark: remark
            }

            //จะได้รู้ว่าอัปเดต record ไหน
            if (id !== '') {
                await axios.put(`${config.apiUrl}/service/update/${id}`, payload)
            } else {
                await axios.post(`${config.apiUrl}/service/create`, payload)
            }

            handleClearForm();
            handleCloseModal();
            FetchData();
        } catch (error: any) {
            Swal.fire({
                icon: 'warning',
                title: 'ผิดพลาด',
                text: error.message
            });
        }
    }

    const handleClearForm = () => {
        setName('')
        setPrice(0)
        setRemark('')
    }

    useEffect(() => {
        FetchData();
    }, []);

    const FetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/service/list`);
            setRepairs(res.data);
        } catch(error: any) {
            Swal.fire({
                icon: 'warning',
                title: 'ผิดพลาด',
                text: error.message
            });
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const button = await Swal.fire({
                icon: 'question',
                title: 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่',
                showCancelButton: true,
                showCloseButton: true
            })

            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/service/remove/${id}`)
                FetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'warning',
                title: 'ผิดพลาด',
                text: error.message
            });
        }
    }

    const handleEdit = async (id: number) => {

        const repair = repairs.find((repair: any) => repair.id === id) as any 
        
        if(repair){
            setId(repair.id)
            setName(repair.name)
            setPrice(repair.price)
            setRemark(repair.remark)
            handleOpenModal();
        }
    }

    return (
        <div>
            <h1 className="content-header">บริการรับซ่อม</h1>
            <div>
                <button className="btn" onClick={handleOpenModal}>
                    <i className="fa-solid fa-plus mr-2"></i>บันทึกงานบริการ
                </button>

                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th className="text-left">ชื่องานบริการ</th>
                            <th className="text-right">ราคา</th>
                            <th className="text-left">หมายเหตุ</th>
                            <th className="text-left">วันที่บันทึก</th>
                            <th className="w-[120px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairs.map((repair: any) => (
                            <tr key={repair.id}>
                                <td>{repair.name}</td>
                                <td className="text-right">{repair.price.toLocaleString()}</td>
                                <td>{repair.remark}</td>
                                <td>{dayjs(repair.payDate).format('DD/MM/YYYY')}</td>
                                <td className="text-center">
                                    <button className="btn-edit mr-1" onClick={() => handleEdit(repair.id)}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>

                                    <button className="btn-delete" onClick={() => handleDelete(repair.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isShow} title="รายการรับซ่อม" onClose={handleCloseModal}>
                <div>
                    <div>ชื่องาน</div>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="mt-4">ราคา</div>
                    <input 
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />

                    <div className="mt-4">หมายเหตุ</div>
                    <input 
                        type="text"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                    />

                    <div>
                        <button className="btn mt-4" onClick={handleSave}>
                            <i className="fa-solid fa-save mr-2"></i>บันทึก
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}