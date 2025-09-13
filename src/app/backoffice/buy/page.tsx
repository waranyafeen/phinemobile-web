"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "@/app/config";
import Swal from "sweetalert2";
import Modal from "@/app//backoffice/modal";
import { buffer } from "stream/consumers";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [serial, setSerial] = useState("");
  const [name, setName] = useState("");
  const [release, setRelease] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [remark, setRemark] = useState("");
  const [products, setProducts] = useState([]); //สินค้าที่ซื้อ
  const [id, setId] = useState(0); //สำหรับแก้ไขข้อมูล
  const [qty, setQty] = useState(1); //จำนวนสินค้า

  // pagination

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page]); // เพิ่ม dependencie ให้ useeffect ค่าของ page เปลี่ยนใหดึงข้อมูลใหม่ทันที

  const fetchData = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/buy/list/${page}`);
      setProducts(res.data.products);
      setTotalRows(res.data.totalRows);
      setTotalPage(res.data.totalPages);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message,
      });
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    try {
      const payload = {
        serial: serial,
        name: name,
        release: release,
        color: color,
        price: price,
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        remark: remark,
        qty: qty,
      };

      if (id === 0) {
        // ส่งค่าไปสร้างข้อมูลใหม่
        await axios.post(`${config.apiUrl}/buy/create`, payload);
      } else {
        // ส่งค่าไปแก้ไขข้อมูล
        await axios.put(`${config.apiUrl}/buy/update/${id}`, payload);
        setId(0); //รีเซ็ต id ให้เป็น 0 เพื่อเตรียมเพิ่มข้อมูลใหม่
      }

      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลสำเร็จ",
        text: "บันทึกเรียบร้อยแล้ว",
        timer: 2000,
      });

      handleCloseModal();
      fetchData(); //รีเฟรชข้อมูลใหม่
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  };

  // แก้ไขข้อมูล ดึงข้อมูลมาแสดงในฟอร์ม
  const handleEdit = (id: number) => {
    const product = products.find((p: any) => p.id === id) as any;
    setSerial(product.serial ?? "");
    setName(product.name);
    setRelease(product.release);
    setColor(product.color);
    setPrice(product.price);
    setCustomerName(product.customerName);
    setCustomerPhone(product.customerPhone);
    setCustomerAddress(product.customerAddress ?? "");
    setRemark(product.remark ?? "");
    setId(product.id);
    handleOpenModal();
  };

    const handleDelete = async (id: number) => {
    try {
      const button = await Swal.fire({
        title: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
      });

      if (button.isConfirmed) {
        await axios.delete(`${config.apiUrl}/buy/remove/${id}`);
        fetchData();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };

  const handleClear = () => {
    setSerial("");
    setName("");
    setRelease("");
    setColor("");
    setPrice(0);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setRemark("");
    setQty(1); //กันบัค
  };

  //export to excel
  const exportToExcel = async () => {
    try {
      const payload = {
        products: products,
      };

      const res = await axios.post(`${config.apiUrl}/buy/export`, payload);
      const fileName = res.data.fileName;
      const a = document.createElement("a");
      a.href = config.apiUrl + "/uploads/" + fileName;
      a.download = fileName;
      a.target = "_blank";
      a.click();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };

  return (
    <div>
      <h1 className="content-header">รายการซื้อ</h1>

      <div>
        <button
          className="btn"
          onClick={() => {
            handleClear();
            handleOpenModal();
          }}
        >
          <i className="fa-solid fa-plus mr-2"></i>เพิ่มรายการ
        </button>

        <button className="btn ms-1" onClick={exportToExcel}>
          <i className="fa-solid fa-file-excel mr-2"></i>Export to excel
        </button>

        <table className="table mt-3">
          <thead>
            <tr>
              <th className="text-left">Serial</th>
              <th className="text-left">ชื่อสินค้า</th>
              <th className="text-left">รุ่น</th>
              <th className="text-left">สี</th>
              <th className="text-right pr-0">ราคา</th>
              <th className="text-left">ชื่อผู้ซื้อ</th>
              <th className="text-left">เบอร์โทรศัพท์ลูกค้า</th>
              <th className="text-left">ที่อยู่ลูกค้า</th>
              <th className="text-left">หมายเหตุ</th>
              <th className="w-[110px] "></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td>{product.serial}</td>
                <td>{product.name}</td>
                <td>{product.release}</td>
                <td>{product.color}</td>
                <td className="text-right">{product.price}</td>
                <td>{product.customerName}</td>
                <td>{product.customerPhone}</td>
                <td>{product.customerAddress}</td>
                <td>{product.remark}</td>
                <td className="text-center">
                  <button
                    className="btn-edit mr-1"
                    onClick={() => handleEdit(product.id)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    className="btn-delete mr-1"
                    onClick={() => handleDelete(product.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5">
          <div>รายการทั้งหมด {totalRows} รายการ</div>
          <div>
            หน้า {page} จาก {totalPage}
          </div>
          <div className="flex gap-1">
            <button className="btn" onClick={() => setPage(1)}>
              <i className="fa-solid fa-caret-left mr-2"></i>หน้าแรก
            </button>
            <button className="btn" onClick={() => setPage(page - 1)}>
              <i className="fa-solid fa-caret-left"></i>
            </button>
            {Array.from({ length: totalPage }, (_, i) => (
              <button
                className={`btn ${i + 1 === page ? "btn-active" : ""}`}
                onClick={() => setPage(i + 1)}
                key={i}
              >
                {i + 1}
              </button>
            ))}
            <button className="btn" onClick={() => setPage(page + 1)}>
              <i className="fa-solid fa-caret-right"></i>
            </button>
            <button className="btn" onClick={() => setPage(totalPage)}>
              หน้าสุดท้าย<i className="fa-solid fa-caret-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      <Modal title="เพิ่มรายการ" isOpen={isOpen} onClose={handleCloseModal}>
        <div className="modal-container">
          <div>serial สินค้า</div>
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />

          <div>ชื่อสินค้า</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div>รุ่น</div>
          <input
            type="text"
            value={release}
            onChange={(e) => setRelease(e.target.value)}
          />

          <div>สี</div>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <div>ราคา</div>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <div>ชื่อผู้ซื้อ</div>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <div>เบอร์โทรศัพท์ลูกค้า</div>
          <input
            type="text"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          <div>ที่อยู่ลูกค้า</div>
          <input
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />

          <div>หมายเหตุ</div>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <div>จำนวนสินค้า</div>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value ?? 0))}
          />

          <div className="mt-2">
            <button className="btn" onClick={handleSave}>
              <i className="fa-solid fa-save mr-2"></i>บันทึก
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
