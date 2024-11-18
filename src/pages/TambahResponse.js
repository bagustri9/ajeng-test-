import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Modal } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';

function TambahResponse() {
    const TINYMCE_API_KEY = "32m4npow6fy9y56ayqpvfnqts7gjzq86xafspc9oajenkfeg";
    const [loginId, setloginId] = useState(false);
    const [baris, setBaris] = useState([]);
    const [rpojk, setRpojk] = useState([]);
    const [responseBaris, setResponseBaris] = useState([]);
    const [responseRpojk, setResponseRpojk] = useState({
        rpojkId: 0,
        status: "",
        declinedReason: "",
        fileName: ""
    });
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
            var baris = db.readAll("baris").filter(x => x.rpojkid == params.id)
            var rpojk = db.readAll("rpojk").find(x => x.id == params.id);
            console.log(baris)
            setBaris(baris);
            setRpojk(rpojk);
            var existResponseRpojk = db.readAll("responseRpojk").find(y => y.rpojkId == params.id)
            console.log(existResponseRpojk)
            setResponseRpojk({
                rpojkId: rpojk.id,
                status: existResponseRpojk != undefined ? existResponseRpojk.status : "",
                declinedReason: existResponseRpojk != undefined ? existResponseRpojk.declinedReason : "",
                fileName: existResponseRpojk != undefined ? existResponseRpojk.fileName : "",
                fileUrl: existResponseRpojk != undefined ? existResponseRpojk.fileUrl : "",
            });
            if (existResponseRpojk != undefined) {
                setResponseBaris(db.readAll("responseBaris").filter(y => y.responseRpojkId == existResponseRpojk.id))
            }
        }
    }, [])

    function handleSave(e) {
        e.preventDefault();
        console.log(e)
        const file = e.target[0].files[0];
        var fileUrl = null;
        if (file) {
            if (file.type === 'application/pdf') {
                fileUrl = URL.createObjectURL(file);
            } else {
                alert('Please upload PDF files only');
                return;
            }
        }
        var defaultFileUrl = file ? fileUrl : responseRpojk?.fileUrl ?? "";
        var defaultFileName = file ? file.name : responseRpojk?.fileName ?? "";
        Swal.fire({
            title: "Tambah Tanggapan ?",
            text: defaultFileName != "" ? "Data dapat difinalisasi. Apakah akan anda finalisasi?" : "Unggah surat untuk memfinalisasi data! Simpan sebagai draft ?",
            icon: "info",
            showDenyButton: defaultFileName != "" ? true : false,
            showCancelButton: true,
            confirmButtonText: defaultFileName != "" ? "Finalisasi" : "Simpan",
            denyButtonText: "Tidak, Simpan Saja",
            cancelButtonText: "Kembali",
        }).then((result) => {
            if (result.isConfirmed) {

            } else if (result.isDenied) {

            } else {
                return;
            }
            var oldResponseRpojk = db.readAll("responseRpojk").find(x => x.rpojkId == params.id)
            var isUpdate = false
            if (oldResponseRpojk != undefined) {
                db.remove("responseRpojk", oldResponseRpojk.id)
                var oldResponseBaris = db.readAll("responseBaris").filter(x => x.responseRpojkId == responseRpojk.id);
                oldResponseBaris.map((old) => {
                    db.remove("responseBaris", old.id)
                });
                isUpdate = true
            }
            var createResponse = db.create("responseRpojk",
                {
                    instansi: loginId, ...responseRpojk, fileUrl: defaultFileUrl, fileName: defaultFileName, status: defaultFileName != "" && result.isConfirmed ? "submitted" : "draft"
                }
            );
            responseBaris.map((data) => {
                db.create("responseBaris", { ...data, responseRpojkId: createResponse.id });
            });
            if (defaultFileName != "" && result.isConfirmed) {
                db.create("notification", { responseRpojkId: createResponse.id, isOpened: false })
            }
            Swal.fire({
                title: "Sukses!",
                text: `Data berhasil ${(isUpdate ? "diupdate" : "dibuat")}!`,
                icon: "success"
            }).then(() => {
                navigate("/")
            });
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
                        <label className='ms-2'><b>1. Tanggapan Substantif</b></label>
                        <Editor
                            initialValue={editData?.substantif ?? ""}
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
                                        old.substantif = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>2. Tanggapan Administratif</b></label>
                        <Editor
                            initialValue={editData?.administratif ?? ""}
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
                                        old.administratif = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>2. Usulan Perubahan</b></label>
                        <Editor
                            initialValue={editData?.usulanPerubahan ?? ""}
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
                                        old.usulanPerubahan = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditData(null)}>
                        Batal
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setResponseBaris(old => {
                            var updateBaris = [...old];
                            console.log(old)
                            var id = old.findIndex(x => x.barisId == editData.barisId);
                            if (id == -1) {
                                updateBaris.push(editData);
                            } else {
                                updateBaris[id] = editData;
                            }
                            console.log(updateBaris)
                            return updateBaris;
                        });
                        setEditData(null);
                    }}>
                        Tambah Tanggapan
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className='col-12 d-flex' style={{ paddingBottom: 40 }}>
                <span className='mx-auto text-center' style={{ fontSize: 18 }}>
                    PEMBUATAN MATRIKS PERMINTAAN TANGGAPAN TERTULIS RPOJK <br />
                    {rpojk.judul}
                </span>
            </div>
            <div className='col-10 offset-1'>
                <div className='card'>
                    <div className='card-body'>
                        <form onSubmit={handleSave}>
                            <div className='d-flex justify-content-between mb-4'>
                                <div className="mb-3">
                                    <label htmlFor="formFile" className="form-label">Lampiran Surat (.pdf)</label>
                                    <input className="form-control" type="file" id="formFile" accept="application/pdf" />
                                    {responseRpojk.fileName && (
                                        <div>
                                            <p>Selected file: {responseRpojk.fileName}</p>
                                            {responseRpojk.fileUrl && (
                                                <a href={responseRpojk.fileUrl} target="_blank" rel="noopener noreferrer">
                                                    View PDF
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className='d-flex'>
                                    <button className='my-auto btn btn-primary' type='submit'>Simpan Tanggapan</button>
                                </div>
                            </div>
                        </form>
                        <div className='table-responsive mt-4'>
                            <table className='table mt-2'>
                                <thead>
                                    <tr className='bg-merah-gelap text-white'>
                                        <td style={{ width: '6%' }}>Baris ke-</td>
                                        <td>Batang Tubuh</td>
                                        <td>Penjelasan</td>
                                        <td>Tanggapan Substantif</td>
                                        <td>Tanggapan Administratif</td>
                                        <td>Usulan Perubahan</td>
                                        <td style={{ width: '4%' }}></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {baris.map((row, index) => (
                                        <tr key={`baris-${index}`}>
                                            <td>{(index + 1)}</td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: row.tubuh }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: row.penjelasan }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.substantif ?? "-" }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.administratif ?? "-" }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.usulanPerubahan ?? "-" }} />
                                            </td>
                                            <td>
                                                {row.dapatDitanggapi ? responseBaris.filter(x => x.barisId == row.id).length > 0 ?
                                                    <div className='d-flex'>
                                                        <button className='p-1 btn btn-success d-flex text-white me-1' onClick={() => {
                                                            setEditData(
                                                                {
                                                                    substantif: responseBaris.find(x => x.barisId == row.id)?.substantif ?? "",
                                                                    administratif: responseBaris.find(x => x.barisId == row.id)?.administratif ?? "",
                                                                    usulanPerubahan: responseBaris.find(x => x.barisId == row.id)?.usulanPerubahan ?? "",
                                                                    barisId: row.id,
                                                                    responseRpojkId: responseRpojk.id
                                                                }
                                                            )
                                                        }}>
                                                            <span className="material-symbols-outlined my-auto mx-auto">
                                                                edit
                                                            </span>
                                                        </button>
                                                    </div> :
                                                    <div className='d-flex'>
                                                        <button className='p-1 btn btn-primary d-flex text-white me-1' onClick={() => {
                                                            setEditData(
                                                                {
                                                                    substantif: "",
                                                                    administratif: "",
                                                                    usulanPerubahan: "",
                                                                    barisId: row.id,
                                                                    responseRpojkId: responseRpojk.id
                                                                }
                                                            )
                                                        }}>
                                                            <span className="material-symbols-outlined my-auto mx-auto">
                                                                add
                                                            </span>
                                                        </button>
                                                    </div>
                                                    : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TambahResponse;
