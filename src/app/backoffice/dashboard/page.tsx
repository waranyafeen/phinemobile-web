'use client';

import { useState, useEffect } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { config } from "@/app/config";
import Swal from "sweetalert2";
import axios from "axios";

export default function Page() {
    const [data, setData] = useState<any[]>([]);
    const [totalIncome, setTotalIncome] = useState(0); //รายได้ทั้งหมด
    const [totalRepair, setTotalRepair] = useState(0); //รายการซ่อมทั้งหมด
    const [totalSale, setTotalSale] = useState(0); //รายการขายทั้งหมด

    useEffect(() => {
        FetchData(); //ดึงข้อมูลฟลังบ้านมา
        renderChart();
    }, []);

    const renderChart = () => {
        const months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม', 
        ];

        //สุ่มเลขมา ยังไม่มี data จริง
        const data = months.map((month, index) => ({
            name: month,
            income: Math.floor(Math.random() * 10000)
        }));

        setData(data);
    };

    const box = (color: string, title: string, value: string) => {
        return (
        <div className={`flex flex-col items-center justify-center text-white rounded-lg shadow-md p-4 ${color}`}>
            <div className="text-lg">{title}</div>
            <div className="text-3xl font-bold">{value}</div>
        </div>
        );
    };

    const FetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/sell/dashboard`)
            setTotalIncome(res.data.totalIncome)
            setTotalRepair(res.data.totalRepair)
            setTotalSale(res.data.totalSale)
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: error.message
            });
        }
    };

    return (
        <div >
            <h1 className="content-header">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {box('bg-purple-600', 'ยอดขายทั้งหมด', totalIncome.toLocaleString() + ' บาท')}
                {box('bg-orange-500', 'งานรับซ่อม', totalRepair.toLocaleString() + ' งาน')}
                {box('bg-blue-600', 'รายการขาย',  totalSale.toLocaleString() + ' รายการ')}
            </div>

            <div className="text-center mb-4 mt-5 text-xl font-bold">รายได้แต่ละเดือน</div>

            <div style={{ width: '100%', height: 400}}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/> 
                        <YAxis />
                        <Tooltip formatter={(value: number) => `รายได้ ${value.toLocaleString()} บาท`}/>
                        <Legend/>
                        <Bar dataKey="income" fill="teal" opacity={0.5}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}