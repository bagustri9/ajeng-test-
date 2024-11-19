import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useOutletContext, useParams } from 'react-router-dom';

function Dashboard() {
    const { Swal, navigate, db } = useOutletContext();
    let params = useParams();
    const [data, setData] = useState({})
    const [tableData, setTabelData] = useState([])
    const [selectedBaris, setSelectedBaris] = useState(0);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        var rpojk = db.readAll("rpojk").find(x => x.id == params.id);
        rpojk.baris = db.readAll("baris").filter(x => x.rpojkid == rpojk.id)
        rpojk.baris.map(x => {
            var responseBaris = db.readAll("responseBaris").filter(y =>
                y.barisId == x.id &&
                db.readAll("responseRpojk").find(z => z.id == y.responseRpojkId).status != "draft"
            );
            responseBaris.map(y => {
                y.responseRpojk = db.readAll("responseRpojk").find(z => z.id == y.responseRpojkId)
                y.user = db.readAll("users").find(z => z.id == y.responseRpojk.instansi)
            })
            x.responseBaris = responseBaris
        })
        setData(rpojk)
        console.log(rpojk)
    }, [refresh])

    useEffect(() => {
        var newData = data.baris == undefined ? [] : data.baris
        console.log(newData)
        setTabelData(newData)
    }, [selectedBaris, data])

    return (
        <div className=' col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <div className='col-8 offset-2 mb-4'>
                <select value={selectedBaris} onChange={(e) => setSelectedBaris(e.target.value)} className="form-select" aria-label="Default select example">
                    <option value={0}>Semua Baris</option>
                    {data.baris != undefined ? data.baris.map((x, index) => (
                        <option key={"option-" + index} value={index + 1}>Baris ke-{index + 1}</option>
                    )) : null}
                </select>
            </div>
            <div className="card col-8 offset-2">
                <div className="card-body shadow-sm p-4" style={{ minHeight: 550 }}>
                    <div className='table-responsive mt-4'>
                        <table className="table">
                            <thead>
                                <tr className="bg-merah-gelap text-white">
                                    <td style={{ minWidth: 200 }}>Instansi</td>
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
                                {
                                    tableData.map((x, index) => (
                                        index == selectedBaris - 1 || selectedBaris == 0 ?
                                            x.responseBaris.map((y, indexY) => (
                                                <tr key={`table-data-${index}-${indexY}`}>
                                                    <td dangerouslySetInnerHTML={{ __html: y.user.name }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: x.tubuh }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: x.penjelasan }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: y.batangSubstantif }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: y.batangAdministratif }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: y.penjelasanSubstantif }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: y.penjelasanAdministratif }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: y.usulanPerubahanBatangTubuh }}></td>
                                                    <td dangerouslySetInnerHTML={{ __html: y.usulanPerubahanPenjelasan }}></td>
                                                </tr>
                                            ))
                                            : null
                                    ))
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
