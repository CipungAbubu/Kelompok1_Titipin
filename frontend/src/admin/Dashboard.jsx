import React, { useState, useEffect } from "react";
import Chart from "../components/Chart";
import ManajemenPembayaran from "../admin/ManajemenPembayaran";
import SidebarAdmin from "../components/SidebarAdmin";
import { HeaderAdmin } from "../components/HeaderAdmin";
import axios from "axios";

function Dashboard() {
  const [pendapatanData, setPendapatanData] = useState([]);
  const [jumlahBarangData, setJumlahBarangData] = useState([]);

  useEffect(() => {
    const fetchRiwayatData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/riwayat"
        );
        const data = response.data;

        // Olah data untuk Chart Pendapatan
        const pendapatan = data.reduce((acc, curr) => {
          const tanggal = new Date(curr.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });
          const existing = acc.find((item) => item.name === tanggal);

          if (existing) {
            existing.total += curr.harga || 0;
          } else {
            acc.push({ name: tanggal, total: curr.harga || 0 });
          }
          return acc;
        }, []);

        // Olah data untuk Chart Jumlah Barang
        const barang = data.reduce((acc, curr) => {
          const tanggal = new Date(curr.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });
          const existing = acc.find((item) => item.name === tanggal);

          if (existing) {
            existing.total += curr.jumlah_barang || 0;
          } else {
            acc.push({ name: tanggal, total: curr.jumlah_barang || 0 });
          }
          return acc;
        }, []);

        setPendapatanData(pendapatan);
        setJumlahBarangData(barang);
      } catch (err) {
        console.error("Error fetching riwayat data:", err);
      }
    };

    fetchRiwayatData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar and main content */}
      <SidebarAdmin />
      <div className="p-8 flex flex-col w-full">
        {/* Header */}
        <HeaderAdmin />

        {/* Charts Section */}
        <div className="flex space-x-4 mb-6">
          <Chart data={pendapatanData} isPendapatan={true} />
          <Chart data={jumlahBarangData} isPendapatan={false} />
        </div>

        {/* Manajemen Pembayaran */}
        <ManajemenPembayaran showHeader={false} showSidebar={false} />
      </div>
    </div>
  );
}

export default Dashboard;
