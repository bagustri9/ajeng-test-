import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useOutletContext, useParams } from 'react-router-dom';

function Dashboard() {
    const { Swal, navigate, db } = useOutletContext();
    let params = useParams();
    const [data, setData] = useState({})
    const [tableData, setTabelData] = useState([])
    const [selectedInstansi, setSelectedInstansi] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [loginId, setloginId] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("loginId") == null) {
            navigate("/login")
        } else {
            setloginId(localStorage.getItem("loginId"));
        }
        var rpojk = db.readAll("rpojk").find(x => x.id == params.id);
        var responseRpojk = db.readAll("responseRpojk").filter(x => x.rpojkId == params.id && x.status != "draft");
        responseRpojk.map(x => {
            x.user = db.readAll("users").find(y => y.id == x.instansi)
        });
        rpojk.responseRpojk = responseRpojk;
        rpojk.responseRpojk.map(x => {
            x.baris = db.readAll("baris").filter(x => x.rpojkid == params.id);
            x.baris.map(y => {
                y.response = db.readAll("responseBaris").find(z => z.barisId == y.id && x.id == z.responseRpojkId);
            });
        });
        setData(rpojk)
        console.log(rpojk)
        console.log('refreshed')
    }, [refresh])

    useEffect(() => {
        if (selectedInstansi != 0) {
            var newData = data.responseRpojk.find(x => x.user.id == selectedInstansi).baris
            setTabelData(newData)
            console.log(newData)
        }
    }, [selectedInstansi])

    return (
        <div className=' col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <div className='col-8 offset-2 mb-4'>
                <select value={selectedInstansi} onChange={(e) => setSelectedInstansi(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value={0} disabled>Pilih Instansi</option>
                    {data.responseRpojk != undefined ? data.responseRpojk.map((x, index) => (
                        <option key={"option-" + index} value={x.user.id}>{x.user.name}</option>
                    )) : null}
                </select>
            </div>
            <div className="card col-8 offset-2">
                <div className="card-body shadow-sm p-4" style={{ minHeight: 550 }}>
                    {/* {selectedInstansi != 0 ?
                        data.responseRpojk.find(x => x.user.id == selectedInstansi).status == "submitted" ?
                            <div className='d-flex justify-content-end mb-3'>
                                <div className='d-flex'>
                                    <button className='btn btn-primary me-2' onClick={() => {
                                        Swal.fire({
                                            title: "Apakah anda yakin?",
                                            text: "Data tidak dapat diubah setelah disimpan!",
                                            icon: "info",
                                            showCancelButton: true,
                                            confirmButtonText: "Ya, terima!",
                                            cancelButtonText: "Batal",
                                            reverseButtons: true
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                var responseRpojkId = data.responseRpojk.find(x => x.user.id == selectedInstansi).id
                                                var currentData = db.readAll("responseRpojk").find(x => x.id == responseRpojkId)
                                                currentData.status = "accepted"
                                                db.update("responseRpojk", responseRpojkId, currentData)
                                                db.create("notification", { instansi: loginId, rpojkId: params.id, isOpened: false, notifFor: data.responseRpojk.find(x => x.user.id == selectedInstansi).instansi })
                                                Swal.fire({
                                                    title: "Sukses!",
                                                    text: "Tanggapan telah diterima!",
                                                    icon: "success"
                                                }).then(() => {
                                                    setRefresh(old => !old);
                                                });
                                            }
                                        });
                                    }}>
                                        Terima
                                    </button>
                                    <button className='btn btn-danger' onClick={() => {
                                        Swal.fire({
                                            title: "Apakah anda yakin?",
                                            text: "Data tidak dapat diubah setelah disimpan!",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonText: "Ya, tolak!",
                                            cancelButtonText: "Batal",
                                            reverseButtons: true,
                                            input: "textarea",
                                            inputLabel: "Alasan Penolakan",
                                            inputPlaceholder: "Type your message here...",
                                            inputAttributes: {
                                                "aria-label": "Type your message here"
                                            },
                                            inputValidator: (value) => {
                                                if (!value) {
                                                    return "Alasan Penolakan harus diisi !";
                                                }
                                            },
                                            showCancelButton: true
                                        }).then((result) => {
                                            console.log(result)
                                            if (result.isConfirmed) {
                                                var responseRpojkId = data.responseRpojk.find(x => x.user.id == selectedInstansi).id
                                                var currentData = db.readAll("responseRpojk").find(x => x.id == responseRpojkId)
                                                currentData.status = "declined"
                                                currentData.declinedReason = result.value
                                                db.update("responseRpojk", responseRpojkId, currentData)
                                                db.create("notification", { instansi: loginId, rpojkId: params.id, isOpened: false, notifFor: data.responseRpojk.find(x => x.user.id == selectedInstansi).instansi })
                                                Swal.fire({
                                                    title: "Sukses!",
                                                    text: "Tanggapan telah ditolak!",
                                                    icon: "success"
                                                }).then(() => {
                                                    setRefresh(old => !old);
                                                });
                                            }
                                        });
                                    }}>
                                        Tolak
                                    </button>
                                </div>
                            </div>
                            : data.responseRpojk.find(x => x.user.id == selectedInstansi).status == "declined" ?
                                <div className="alert alert-danger" role="alert">
                                    Tanggapan telah ditolak !
                                </div>
                                : data.responseRpojk.find(x => x.user.id == selectedInstansi).status == "accepted" ?
                                    <div className="alert alert-success" role="alert">
                                        Tanggapan telah diterima !
                                    </div> : null
                        : null} */}
                    <div className='table-responsive mt-4'>
                        <table className="table">
                            <thead>
                                <tr className="bg-merah-gelap text-white">
                                    <td style={{ minWidth: 100 }}>Baris ke-</td>
                                    <td style={{ minWidth: 400 }}>Batang Tubuh</td>
                                    <td style={{ minWidth: 400 }}>Penjelasan</td>
                                    <td style={{ minWidth: 400 }}>Tanggapan Batang Tubuh Substantif</td>
                                    <td style={{ minWidth: 400 }}>Tanggapan Batang Tubuh Administratif</td>
                                    <td style={{ minWidth: 400 }}>Tanggapan Penjelasan Substantif</td>
                                    <td style={{ minWidth: 400 }}>Tanggapan Penjelasan Administratif</td>
                                    <td style={{ minWidth: 400 }}>Usulan Perubahan Batang Tubuh</td>
                                    <td style={{ minWidth: 400 }}>Usulan Perubahan Penjelasan</td>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedInstansi != 0 ?
                                    tableData.map((x, index) => (
                                        <tr key={`table-data-${index}`}>
                                            <td>{index + 1}</td>
                                            <td dangerouslySetInnerHTML={{ __html: x.tubuh }}></td>
                                            <td dangerouslySetInnerHTML={{ __html: x.penjelasan }}></td>
                                            <td dangerouslySetInnerHTML={{ __html: x.response?.batangSubstantif ?? "-" }}></td>
                                            <td dangerouslySetInnerHTML={{ __html: x.response?.batangAdministratif ?? "-" }}></td>
                                            <td dangerouslySetInnerHTML={{ __html: x.response?.penjelasanSubstantif ?? "-" }}></td>
                                            <td dangerouslySetInnerHTML={{ __html: x.response?.penjelasanAdministratif ?? "-" }}></td>
                                            <td dangerouslySetInnerHTML={{ __html: x.response?.usulanPerubahanBatangTubuh ?? "-" }}></td>
                                            <td dangerouslySetInnerHTML={{ __html: x.response?.usulanPerubahanPenjelasan ?? "-" }}></td>
                                        </tr>
                                    )) :
                                    <tr>
                                        <td colSpan={7} className='text-center'>
                                            Pilih instansi terlebih dahulu !
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
