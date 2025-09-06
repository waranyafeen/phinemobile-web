'use client';

import { use, useEffect, useState } from "react";
import axios  from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";
import Modal from "@/app//backoffice/modal";

export default function Page() {
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [level, setLevel] = useState('user');
    const [levelList, setLevelList] = useState(['admin', 'user']);
    const [isShowModal, setShowModal] = useState(false);

    useEffect(() => { 
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/user/list`)
            setUsers(response.data);
        } catch(error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: error.message
            })
        }
    }

    const handleOpenModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSave = async () => {
        try {

            //เช็ค password ก่อนว่าตรงกันมั้ย
            if (password !== passwordConfirm) {
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: 'รหัสผ่านที่กรอกไม่ตรงกัน'
                });
                return
            }

            //ข้อมูลที่จะส่งไปหลังบ้าน
            const payload = {
                name: name,
                username: username,
                password: password,
                level: level
            }

            //เช็คว่าจะยิง req ไปที่ไหน
            //ถ้า id เป็นค่าว่างให้ยิง req ไปที่ create 
            if (id === '') {
                await axios.post(`${config.apiUrl}/user/create`, payload)
            } else {
                await axios.put(`${config.apiUrl}/user/update/${id}`, payload)
                setId(''); //ให้เป็นค่าว่างเพื่อเคลียร์ค่า
            }

            fetchData();
            handleCloseModal();

        } catch(error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: error.message
            });
        }
    }

    const handleEdit = async (id: string) => { //รับ id เข้ามา

        //ค้นหา user แล้ว set ทีละค่า
        const user = users.find((user: any) => user.id === id) as any

        setId(user.id)
        setName(user.name)
        setUsername(user.username)
        setLevel(user.level)
        setShowModal(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const button = await Swal.fire({
                icon: 'question',
                title: 'คุณต้องการลบข้อมูลผู้ใช้หรือไม่',
                showCancelButton: true,
                showConfirmButton: true
            });

            //เช็คว่ายืนยันรึยัง 
            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/user/remove/${id}`)
                fetchData();
            }

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: error.message
            })
        }
    }

    return (
        <div>
            <h1 className="content-header">ผู้ใช้งาน</h1>
            <div>
                <button className="btn" onClick={handleOpenModal}>
                    <i className="fa-solid fa-plus mr-2"></i>เพิ่มผู้ใช้งาน
                </button>

                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th className="text-left">ชื่อผู้ใช้งาน</th>
                            <th className="text-left">username</th>
                            <th className="text-left">level</th>
                            <th className="w-[110px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.level}</td>
                                <td>
                                    <button className="btn-edit mr-1" onClick={() => handleEdit(user.id)}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal title="เพิ่มผู้ใช้งาน" isOpen={isShowModal} onClose={handleCloseModal} >

                    <div>
                        <div>ชื่อผู้ใช้งาน</div>
                        <input 
                            type="text" 
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mt-4">
                        <div>Username</div>
                        <input 
                            type="text" 
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mt-4">
                        <div>Password</div>
                        <input 
                            type="password" 
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mt-4">
                        <div>Confirm Password</div>
                        <input 
                            type="password" 
                            className="input"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>

                    <div className="mt-4">
                        <div>Level</div>
                        <select 
                            className="form-control"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            {levelList.map((item: any) => ( 
                                <option value={item} key={item}>{item}</option>
                            ))} 
                        </select>
                    </div>

                    <div className="mt-4">
                        <button className="btn" onClick={handleSave}>
                            <i className="fa-solid fa-save mr-2"></i>เพิ่มผู้ใช้งาน
                        </button>
                    </div>
                    
                </Modal>
            </div>
        </div>
    )
}