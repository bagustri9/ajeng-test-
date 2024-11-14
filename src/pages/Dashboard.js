import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("isAdmin") == "true") {
            setIsAdmin(true);
        }
    }, [])

    return (
        <div className=' col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <div className='col-12 d-flex' style={{ paddingBottom: 40 }}>
                <span className='mx-auto' style={{ fontSize: 18 }}>
                    DAFTAR RANCANGAN PERATURAN OJK
                </span>
            </div>
            <div className="card col-8 offset-2">
                <div className="card-body shadow-sm p-4" style={{ minHeight: 550 }}>
                    {isAdmin ?
                        <>
                            <Link to='/tambah-rpojk' className='btn btn-success mb-4'>+ Tambah RPOJK</Link>
                            <table className="table">
                                <thead>
                                    <tr className="bg-merah-gelap text-white">
                                        <th scope="col">No.</th>
                                        <th scope="col">Judul</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Bank Umum</td>
                                        <td>
                                            <div className='d-flex justify-content-end'>
                                                <button className='btn bg-merah-gelap px-3 text-white me-2'>Instansi</button>
                                                <button className='btn btn-primary px-3'>Pasal</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                        :
                        <table className="table">
                            <thead>
                                <tr className="bg-merah-gelap text-white">
                                    <th scope="col">No.</th>
                                    <th scope="col">Judul</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Batas Waktu</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Bank Umum</td>
                                    <td><span className="badge rounded-pill bg-danger">Belum Diisi</span></td>
                                    <td>{`${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}</td>
                                    <td>
                                        <span className="material-symbols-outlined">
                                            more_vert
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Bank Umum</td>
                                    <td><span className="badge rounded-pill bg-warning">Sedang Diisi</span></td>
                                    <td>{`${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}</td>
                                    <td>
                                        <span className="material-symbols-outlined">
                                            more_vert
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Bank Umum</td>
                                    <td><span className="badge rounded-pill bg-success">Sudah Diisi</span></td>
                                    <td>{`${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}</td>
                                    <td>
                                        <span className="material-symbols-outlined">
                                            more_vert
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
