import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './Dashboard.css';
import { Button, Modal } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';

function Dashboard() {
    const TINYMCE_API_KEY = "32m4npow6fy9y56ayqpvfnqts7gjzq86xafspc9oajenkfeg";
    const [loginId, setloginId] = useState(false);
    const [baris, setBaris] = useState([]);
    const [rpojk, setRpojk] = useState([]);
    const [editData, setEditData] = useState(null);
    const { Swal, navigate, db } = useOutletContext();
    let params = useParams();

    useEffect(() => {
        if (localStorage.getItem("loginId") == null) {
            navigate("/login")
        } else {
            setloginId(localStorage.getItem("loginId"));
        }
        if (params.id != undefined) {
            setBaris(db.readAll("baris").filter(x => x.rpojkid == params.id));
            setRpojk(db.readAll("rpojk").find(x => x.id == params.id))
        }
    }, [])

    function handleSave(e) {
        e.preventDefault();
        var isPublished = false;
        Swal.fire({
            title: "Terbitkan RPOJK ?",
            text: "Data akan disimpan. Apakah anda juga ingin menerbitkan RPOJK ?",
            icon: "info",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "Terbitkan",
            denyButtonText: "Tidak",
            cancelButtonText: "Kembali",
        }).then((result) => {
            if (result.isConfirmed) {
                isPublished = true;
            } else if (result.isDenied) {

            } else {
                return;
            }
            if (params.id == undefined) {
                var rpojkDataBaru = db.create("rpojk", { judul: e.target[1].value, isPublished: isPublished, createdDate: new Date() });
                baris.map((data) => {
                    db.create("baris", { ...data, rpojkid: rpojkDataBaru.id });
                });
                Swal.fire({
                    title: "Sukses!",
                    text: "Data berhasil ditambahkan!",
                    icon: "success"
                }).then(() => {
                    navigate("/")
                });
            } else {
                db.update("rpojk", params.id, { judul: e.target[1].value, isPublished: isPublished });
                var oldBaris = db.readAll("baris").filter(x => x.rpojkid == params.id);
                console.log(oldBaris)
                oldBaris.map((old) => {
                    db.remove("baris", old.id)
                });
                baris.map((data) => {
                    db.create("baris", { ...data, rpojkid: params.id });
                });
                Swal.fire({
                    title: "Sukses!",
                    text: "Data berhasil diupdate!",
                    icon: "success"
                }).then(() => {
                    navigate("/")
                });
            }
        });
    }

    return (
        <div className='col-12' style={{ paddingTop: 40, fontWeight: 600 }}>
            <Modal size="lg" show={editData != null} onHide={() => setEditData(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Baris</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-4'>
                        <label className='ms-2'><b>1. Batang Tubuh</b></label>
                        <Editor
                            initialValue={editData == null ? "" : editData.tubuh}
                            apiKey={TINYMCE_API_KEY}
                            init={{
                                height: 200,
                                menubar: true,
                                plugins: [
                                    'lists'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help'
                            }}
                            onEditorChange={(content, editor) => {
                                if (editData != null) {
                                    setEditData(old => {
                                        old.tubuh = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>2. Penjelasan</b></label>
                        <Editor
                            initialValue={editData == null ? "" : editData.penjelasan}
                            apiKey={TINYMCE_API_KEY}
                            init={{
                                height: 200,
                                menubar: true,
                                plugins: [
                                    'lists'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help'
                            }}
                            onEditorChange={(content, editor) => {
                                if (editData != null) {
                                    setEditData(old => {
                                        old.penjelasan = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>3. Dapat Ditanggapi ? </b></label>
                        <input className='ms-2' type='checkbox' defaultChecked={editData == null ? false : editData.dapatDitanggapi} onChange={() => setEditData(old => {
                            var newData = { ...old }
                            newData.dapatDitanggapi = !newData.dapatDitanggapi
                            return newData
                        })} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditData(null)}>
                        Batal
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setBaris(old => {
                            var updateBaris = [...old];
                            var id = old.findIndex(x => x.urutan == editData.urutan);
                            if (id == -1) {
                                updateBaris.push(editData);
                            } else {
                                updateBaris[id] = editData;
                            }
                            return updateBaris;
                        });
                        setEditData(null);
                    }}>
                        Tambah Baris
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className='col-12 d-flex' style={{ paddingBottom: 40 }}>
                <span className='mx-auto' style={{ fontSize: 18 }}>
                    PEMBUATAN MATRIKS PERMINTAAN TANGGAPAN TERTULIS RPOJK
                </span>
            </div>
            <div className='col-8 offset-2'>
                <div className='card'>
                    <div className='card-body'>
                        <form onSubmit={handleSave}>
                            <div className='d-flex mb-3 justify-content-end'>
                                <button className='btn btn-primary'>Simpan Data</button>
                            </div>
                            <div className='d-flex'>
                                <label className='my-auto me-2'>Judul</label>
                                <input className="my-auto flex-grow-1" defaultValue={rpojk.judul} name="judul" required={true} />
                            </div>
                        </form>
                        <div className='table-responsive mt-4'>
                            <table className='table mt-2'>
                                <thead>
                                    <tr className='bg-merah-gelap text-white'>
                                        <td className='col-1'>Baris ke-</td>
                                        <td className='col-4'>Batang Tubuh</td>
                                        <td className='col-4'>Penjelasan</td>
                                        <td className='col-2'>Dapat Ditanggapi</td>
                                        <td>Aksi</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {baris.map((row, index) => (
                                        <tr key={`baris-${index}`}>
                                            <td>{(index + 1)}</td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: row.tubuh }}>
                                                </div>
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: row.penjelasan }}>
                                                </div>
                                            </td>
                                            <td>
                                                <input type='checkbox' checked={row.dapatDitanggapi} onChange={(e) => setBaris(old => {
                                                    var newData = [...old];
                                                    newData[index].dapatDitanggapi = !newData[index].dapatDitanggapi
                                                    return newData;
                                                })} />
                                            </td>
                                            <td>
                                                <div className='d-flex'>
                                                    <button className='p-1 btn btn-success d-flex text-white me-1' onClick={() => {
                                                        setEditData({
                                                            tubuh: row.tubuh,
                                                            penjelasan: row.penjelasan,
                                                            dapatDitanggapi: row.dapatDitanggapi,
                                                            urutan: row.urutan,
                                                        })
                                                    }}>
                                                        <span className="material-symbols-outlined my-auto mx-auto">
                                                            edit
                                                        </span>
                                                    </button>
                                                    <button className='p-1 btn btn-danger d-flex text-white me-1' onClick={() => {
                                                        setBaris(old => {
                                                            var newArray = old.filter((y, i) => i != index)
                                                            return newArray
                                                        })
                                                    }}>
                                                        <span className="material-symbols-outlined">
                                                            delete
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='col-12 d-flex justify-content-center'>
                                <button className='btn bg-merah-gelap text-white' onClick={() => {
                                    var urut = baris.length == 0 ? 0 : Math.max(...baris.map(item => item.urutan))
                                    setEditData({
                                        tubuh: "",
                                        penjelasan: "",
                                        dapatDitanggapi: false,
                                        urutan: urut + 1,
                                    })
                                }}>+ Tambah Baris Baru</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
