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
    const [selectedInstansi, setSelectedInstansi] = useState(0);

    useEffect(() => {
        console.log(params.id)
        if (localStorage.getItem("isAdmin") == "true") {
            setIsAdmin(true);
        }
    }, [])

    return (
        <div className=' col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <div className='col-8 offset-2 mb-4'>
                <select value={selectedInstansi} onChange={(e) => setSelectedInstansi(e.target.value)} class="form-select" aria-label="Default select example">
                    <option value={0} disabled>Pilih Instansi</option>
                    {data.map(x => (
                        <option value={x.id}>{x.instansi}</option>
                    ))}
                </select>
            </div>
            <div className="card col-8 offset-2">
                <div className="card-body shadow-sm p-4" style={{ minHeight: 550 }}>
                    <table className="table">
                        <thead>
                            <tr className="bg-merah-gelap text-white">
                                <th scope="col">Baris</th>
                                <th scope="col">Penjelasan</th>
                                <th scope="col">Tanggapan</th>
                                <th scope="col">Tipe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedInstansi != 0 ?
                                data.find(x => x.id == selectedInstansi).pasal.map(x => (
                                    <tr>
                                        <td>{x.no}</td>
                                        <td>{x.penjelasan}</td>
                                        <td>{x.tanggapan}</td>
                                        <td>{(x.tipe == 0 ? "Substantif" : "Administratif")}</td>
                                    </tr>
                                )) :
                                <tr>
                                    <td colSpan={4} className='text-center'>
                                        Pilih instansi terlebih dahulu !
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
