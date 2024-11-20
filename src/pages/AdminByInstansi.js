import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useOutletContext, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';

function Dashboard() {
    const { Swal, navigate, db } = useOutletContext();
    let params = useParams();
    const [data, setData] = useState({})
    const [tableData, setTabelData] = useState([])
    const [kategori, setKategori] = useState([])
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
        var kategori = db.readAll("kategori");
        setKategori(kategori)
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
    }, [refresh])

    useEffect(() => {
        if (selectedInstansi != 0) {
            var newData = data.responseRpojk.filter(x => x.user.kategoriId == selectedInstansi)
            var baris = []
            newData.map(x => {
                x.baris.map(y => {
                    y.user = x.user
                });
                baris = [...baris, ...x.baris]
            })
            setTabelData(baris)
        }
    }, [selectedInstansi])

    const handleExport = () => {
        // Create a worksheet from the data
        var dataExport = [];
        if (selectedInstansi != 0 && tableData.length > 0) {
            tableData.map((x, index) => {
                dataExport.push({
                    "Baris Ke": index + 1,
                    "Instansi": x.user.name,
                    "Batang Tubuh": x.tubuhPlain,
                    "Penjelasan": x.penjelasanPlain,
                    "Tanggapan Batang Tubuh Substantif": x.response?.batangSubstantifPlain ?? "-",
                    "Tanggapan Batang Tubuh Administratif": x.response?.batangAdministratifPlain ?? "-",
                    "Tanggapan Penjelasan Substantif": x.response?.penjelasanSubstantifPlain ?? "-",
                    "Tanggapan Penjelasan Administratif": x.response?.penjelasanAdministratifPlain ?? "-",
                    "Usulan Perubahan Batang Tubuh": x.response?.usulanPerubahanBatangTubuhPlain ?? "-",
                    "Usulan Perubahan Penjelasan": x.response?.usulanPerubahanPenjelasanPlain ?? "-"
                })
            })
        }
        const ws = XLSX.utils.json_to_sheet(dataExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `Ekspor_Tanggapan_${`${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`}.xlsx`);
    };

    return (
        <div className=' col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <div className='col-8 offset-2 mb-4'>
                <select value={selectedInstansi} onChange={(e) => setSelectedInstansi(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value={0} disabled>Pilih Instansi</option>
                    {kategori.map((x, index) => (
                        <option key={"option-" + index} value={x.id}>{x.name}</option>
                    ))}
                </select>
            </div>
            <div className="card col-8 offset-2">
                <div className="card-body shadow-sm p-4" style={{ minHeight: 550 }}>
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-success' onClick={handleExport}>Ekspor Data</button>
                    </div>
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
                                    <td style={{ minWidth: 300 }}>Instansi</td>
                                    <td style={{ minWidth: 300 }}>Batang Tubuh</td>
                                    <td style={{ minWidth: 300 }}>Penjelasan</td>
                                    <td style={{ minWidth: 300 }}>Tanggapan Batang Tubuh Substantif</td>
                                    <td style={{ minWidth: 300 }}>Tanggapan Batang Tubuh Administratif</td>
                                    <td style={{ minWidth: 300 }}>Tanggapan Penjelasan Substantif</td>
                                    <td style={{ minWidth: 300 }}>Tanggapan Penjelasan Administratif</td>
                                    <td style={{ minWidth: 300 }}>Usulan Perubahan Batang Tubuh</td>
                                    <td style={{ minWidth: 300 }}>Usulan Perubahan Penjelasan</td>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedInstansi != 0 ?
                                    tableData.length == 0 ?
                                        <tr>
                                            <td colSpan={7} className='text-center'>
                                                Data kosong !
                                            </td>
                                        </tr>
                                        :
                                        tableData.map((x, index) => (
                                            <tr key={`table-data-${index}`}>
                                                <td>{index + 1}</td>
                                                <td dangerouslySetInnerHTML={{ __html: x.user.name }}></td>
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
