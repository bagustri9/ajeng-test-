import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link, useParams } from 'react-router-dom';
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';

function Dashboard() {
    const [isAdmin, setIsAdmin] = useState(false);
    let params = useParams();
    const [data, setData] = useState([
        {
            id: 1,
            instansi: "Bank Umum",
            pasal: [
                {
                    no: 1,
                    penjelasan: "Contoh Penjelasan Bank Umum 1",
                    tanggapan: "Contoh Tanggapan Bank Umum 1",
                    tipe: 0
                },
                {
                    no: 2,
                    penjelasan: "Contoh Penjelasan Bank Umum 2",
                    tanggapan: "Contoh Tanggapan Bank Umum 2",
                    tipe: 1
                },
                {
                    no: 3,
                    penjelasan: "Contoh Penjelasan Bank Umum 3",
                    tanggapan: "Contoh Tanggapan Bank Umum 3",
                    tipe: 0
                },
            ]
        },
        {
            id: 2,
            instansi: "Bank Tidak Umum",
            pasal: [
                {
                    no: 1,
                    penjelasan: "Contoh Penjelasan Bank Tidak Umum 1",
                    tanggapan: "Contoh Tanggapan Bank Tidak Umum 1",
                    tipe: 0
                },
                {
                    no: 2,
                    penjelasan: "Contoh Penjelasan Bank Tidak Umum 2",
                    tanggapan: "Contoh Tanggapan Bank Tidak Umum 2",
                    tipe: 1
                },
                {
                    no: 3,
                    penjelasan: "Contoh Penjelasan Bank Tidak Umum 3",
                    tanggapan: "Contoh Tanggapan Bank Tidak Umum 3",
                    tipe: 0
                },
            ]
        }
    ])
    const [selectedBaris, setSelectedBaris] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("isAdmin") == "true") {
            setIsAdmin(true);
        }
    }, [])

    return (
        <div className=' col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <div className='col-8 offset-2 mb-4'>
                <select value={selectedBaris} onChange={(e) => setSelectedBaris(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value={0} disabled>Pilih Baris</option>
                    <option value={1}>Baris ke-1</option>
                    <option value={2}>Baris ke-2</option>
                    <option value={3}>Baris ke-3</option>
                </select>
            </div>
            <div className="card col-8 offset-2">
                <div className="card-body shadow-sm p-4" style={{ minHeight: 550 }}>
                    <table className="table">
                        <thead>
                            <tr className="bg-merah-gelap text-white">
                                <th scope="col">Instansi</th>
                                <th scope="col">Penjelasan</th>
                                <th scope="col">Tanggapan</th>
                                <th scope="col">Tipe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBaris != 0 ?
                                data.map((x, index) => (
                                    <tr key={"baris-" + index}>
                                        <td>{x.instansi}</td>
                                        <td>{x.pasal.find(y => y.no == selectedBaris).penjelasan}</td>
                                        <td>{x.pasal.find(y => y.no == selectedBaris).tanggapan}</td>
                                        <td>{(x.pasal.find(y => y.no == selectedBaris).tipe == 0 ? "Substantif" : "Administratif")}</td>
                                    </tr>
                                )) :
                                <tr>
                                    <td colSpan={4} className='text-center'>
                                        Pilih nomor baris terlebih dahulu !
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
