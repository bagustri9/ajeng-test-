import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {

    return (
        <div className=' col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <div className='col-12 d-flex' style={{ paddingBottom: 40 }}>
                <span className='mx-auto' style={{ fontSize: 18 }}>
                    DAFTAR RANCANGAN PERATURAN OJK
                </span>
            </div>
            <div class="card col-8 offset-2">
                <div class="card-body shadow-sm p-4" style={{minHeight:550}}>
                    <table class="table">
                        <thead>
                            <tr class="bg-merah-gelap text-white">
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
                                <td><span class="badge rounded-pill bg-danger">Belum Diisi</span></td>
                                <td>{`${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}</td>
                                <td>
                                    <span class="material-symbols-outlined">
                                        more_vert
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
