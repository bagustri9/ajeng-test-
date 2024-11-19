import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link, useOutletContext } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function Dashboard() {
    var { navigate, db, Swal } = useOutletContext();
    const [loginId, setloginId] = useState(false);
    const [rpojk, setRpojk] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("loginId") == null) {
            navigate("/login")
        } else {
            setloginId(localStorage.getItem("loginId"));
        }
        var rpojkData = db.readAll("rpojk");
        setRpojk(rpojkData);
        var responseData = db.readAll("responseRpojk").filter(x => x.instansi == localStorage.getItem("loginId"));
        setResponses(responseData);
        console.log(responseData)
    }, [refresh])

    return (
        <div className=' col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <div className='col-12 d-flex' style={{ paddingBottom: 40 }}>
                <span className='mx-auto' style={{ fontSize: 18 }}>
                    DAFTAR RANCANGAN PERATURAN OJK
                </span>
            </div>
            <div className="card col-8 offset-2">
                <div className="card-body shadow-sm p-4" style={{ minHeight: 550 }}>
                    {loginId == 0 ?
                        <>
                            <Link to='/rpojk/tambah' className='btn btn-success mb-4'>+ Tambah RPOJK</Link>
                            <table className="table table-hover">
                                <thead>
                                    <tr className="bg-merah-gelap text-white">
                                        <th scope="col">No.</th>
                                        <th scope="col">Judul</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rpojk.map((x, index) => (
                                        <tr key={`baris-${index}`} style={{ cursor: !x.isPublished ? 'pointer' : 'not-allowed' }}>
                                            <th className='col-1' onClick={() => { if (!x.isPublished) navigate("/rpojk/tambah/" + x.id) }} scope="row">{index + 1}</th>
                                            <td onClick={() => { if (!x.isPublished) navigate("/rpojk/tambah/" + x.id) }}>{x.judul}</td>
                                            <td className='col-2' onClick={() => { if (!x.isPublished) navigate("/rpojk/tambah/" + x.id) }}>
                                                {(x.isPublished ? <span className="badge bg-success text-light my-auto">Telah Rilis</span> : <span className="badge bg-warning text-light my-auto">Draft</span>)}
                                            </td>
                                            <td className='col-2'>
                                                <div className='d-flex justify-content-start'>
                                                    {!x.isPublished ?
                                                        <>
                                                            <button onClick={() => {
                                                            }} className='btn btn-success text-white d-flex me-2'>
                                                                <span className="material-symbols-outlined my-auto">
                                                                    publish
                                                                </span>&nbsp;
                                                                <span className='my-auto'>
                                                                    Rilis
                                                                </span>
                                                            </button>
                                                            <button onClick={() => {
                                                                Swal.fire({
                                                                    title: "Apakah anda yakin?",
                                                                    text: "Data yang dihapus tidak dapat dikembalikan!",
                                                                    icon: "warning",
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: "#3085d6",
                                                                    cancelButtonColor: "#d33",
                                                                    confirmButtonText: "Ya, Hapus!",
                                                                    cancelButtonText: "Batal"
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        db.remove("rpojk", x.id)
                                                                        Swal.fire({
                                                                            title: "Dihapus!",
                                                                            text: "Data berhasil dihapus.",
                                                                            icon: "success"
                                                                        }).then(() => {
                                                                            setRefresh(old => !old);
                                                                        });
                                                                    }
                                                                });
                                                            }} className='btn btn-warning text-white d-flex'>
                                                                <span className="material-symbols-outlined my-auto">
                                                                    delete
                                                                </span>&nbsp;
                                                                <span className='my-auto'>
                                                                    Hapus
                                                                </span>
                                                            </button>
                                                        </>
                                                        :
                                                        <>
                                                            <Link to={`/instansi/${x.id}`} className='btn bg-merah-gelap px-3 text-white me-2 d-flex'>
                                                                <span className="material-symbols-outlined my-auto">
                                                                    apartment
                                                                </span>&nbsp;
                                                                <span className='my-auto'>
                                                                    Instansi
                                                                </span>
                                                            </Link>
                                                            <Link to={`/baris/${x.id}`} className='btn btn-primary px-3 me-2 d-flex'>
                                                                <span className="material-symbols-outlined my-auto">
                                                                    article
                                                                </span>&nbsp;
                                                                <span className='my-auto'>
                                                                    Pasal
                                                                </span>
                                                            </Link>
                                                        </>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {rpojk.length == 0 ?
                                        <tr>
                                            <td colSpan={4} className='text-center'>Belum ada RPOJK!</td>
                                        </tr> : null}
                                </tbody>
                            </table>
                        </>
                        :
                        <table className="table table-hover">
                            <thead>
                                <tr className="bg-merah-gelap text-white">
                                    <th scope="col">No.</th>
                                    <th scope="col">Judul</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Batas Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rpojk.filter(x => x.isPublished).map((x, index) => (
                                    <tr key={`baris-${index}`} style={{ cursor: responses.find(y => y.rpojkId == x.id) == undefined || responses.find(y => y.rpojkId == x.id).status == "draft" || responses.find(y => y.rpojkId == x.id).status == "declined" ? "pointer" : "text" }}
                                        onClick={() => {
                                            var respon = responses.find(y => y.rpojkId == x.id);
                                            if (respon == undefined || respon.status == "draft" || respon.status == "declined") {
                                                navigate("/response/" + x.id)
                                            }
                                        }}
                                    >
                                        <th scope="row">{index + 1}</th>
                                        <td>{x.judul}</td>
                                        <td>
                                            {
                                                responses.find(y => y.rpojkId == x.id) == undefined ?
                                                    <span className="badge rounded-pill bg-secondary">Belum Diisi</span>
                                                    : responses.find(y => y.rpojkId == x.id).status == "draft" ?
                                                        <span className="badge rounded-pill bg-warning text-light">Draft</span>
                                                        : responses.find(y => y.rpojkId == x.id).status == "submitted" ?
                                                            <span className="badge rounded-pill bg-primary text-light">Telah Dikirim</span>
                                                            : responses.find(y => y.rpojkId == x.id).status == "declined" ?
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    delay={{ show: 250, hide: 400 }}
                                                                    overlay={(props) => (
                                                                        <Tooltip id="button-tooltip" {...props}>
                                                                          Alasan Ditolak : {responses.find(y => y.rpojkId == x.id).declinedReason}
                                                                        </Tooltip>
                                                                      )}
                                                                >
                                                                    <span className="badge rounded-pill bg-danger text-light">Ditolak</span>
                                                                </OverlayTrigger>
                                                                : responses.find(y => y.rpojkId == x.id).status == "accepted" ?
                                                                    <span className="badge rounded-pill bg-success text-light">Diterima</span>
                                                                    : null

                                            }
                                        </td>
                                        <td>{`${new Date(x.createdDate).getHours()}:${new Date(x.createdDate).getMinutes()} ${new Date(x.createdDate).getDate()}/${new Date(x.createdDate).getMonth()}/${new Date(x.createdDate).getFullYear()}`}</td>
                                    </tr>
                                ))}
                            {rpojk.filter(x => x.isPublished).length == 0 ?
                                <tr>
                                    <td colSpan={6} className='text-center'>Belum ada RPOJK yang dirilis!</td>
                                </tr> : null}
                        </tbody>
                        </table>
                    }
            </div>
        </div>
        </div >
    );
}

export default Dashboard;
