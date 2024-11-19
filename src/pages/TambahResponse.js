import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Modal } from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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
            setBaris(baris);
            setRpojk(rpojk);
            console.log(localStorage.getItem("loginId"))
            var existResponseRpojk = db.readAll("responseRpojk").find(y => y.rpojkId == params.id && y.instansi == localStorage.getItem("loginId"))
            console.log(existResponseRpojk)
            setResponseRpojk({
                rpojkId: rpojk.id,
                status: existResponseRpojk != undefined ? existResponseRpojk.status : "",
                declinedReason: existResponseRpojk != undefined ? existResponseRpojk.declinedReason : "",
            });
            if (existResponseRpojk != undefined) {
                setResponseBaris(db.readAll("responseBaris").filter(y => y.responseRpojkId == existResponseRpojk.id))
            }
        }
    }, [])

    function handleSave(e) {
        e.preventDefault();
        Swal.fire({
            title: "Tambah Tanggapan ?",
            text: "Apakah tanggapan akan anda finalisasi?",
            icon: "info",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Finalisasi",
            denyButtonText: "Simpan Sebagai Draft",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {

            } else if (result.isDenied) {

            } else {
                return;
            }
            var oldResponseRpojk = db.readAll("responseRpojk").find(x => x.rpojkId == params.id && x.instansi == loginId)
            var isUpdate = false
            if (oldResponseRpojk != undefined) {
                db.remove("responseRpojk", oldResponseRpojk.id)
                var oldResponseBaris = db.readAll("responseBaris").filter(x => x.responseRpojkId == oldResponseRpojk.id);
                oldResponseBaris.map((old) => {
                    db.remove("responseBaris", old.id)
                });
                isUpdate = true
            }
            var createResponse = db.create("responseRpojk",
                {
                    instansi: loginId, ...responseRpojk, status: result.isConfirmed ? "submitted" : "draft"
                }
            );
            responseBaris.map((data) => {
                db.create("responseBaris", { ...data, responseRpojkId: createResponse.id });
            });
            if (result.isConfirmed) {
                db.create("notification", { instansi: loginId, rpojkId: createResponse.rpojkId, isOpened: false, notifFor: 0 })
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
                        <label className='ms-2'><b>1. Tanggapan Batang Tubuh Substantif</b></label>
                        <Editor
                            initialValue={editData?.batangSubstantif ?? ""}
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
                                    'removeformat | help',
                                placeholder: `Tanggapan substantif: tanggapan yang bersifat mengubah isi atau pokok inti atau makna dari bagian tubuh dan/atau penjelasan peraturan. Contoh: memperjelas kriteria Lembaga penunjang dan jenis LP yang dimaksud. Apakah termasuk Lembaga pengayom?`
                            }}
                            onEditorChange={(content, editor) => {
                                if (editData != null) {
                                    setEditData(old => {
                                        old.batangSubstantif = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>2. Tanggapan Batang Tubuh Administratif</b></label>
                        <Editor
                            initialValue={editData?.batangAdministratif ?? ""}
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
                                    'removeformat | help',
                                placeholder: `Tanggapan administratif: tanggapan terhadap ejaan, tata bahasa, peristilahan, singkatan, dan kesalahan penulisan kata yang tidak mempengaruhi makna bagian tubuh dan penjelasan peraturan
                                    Contoh:
                                    istilah “selain produktif” diganti “non produktif”.`
                            }}
                            onEditorChange={(content, editor) => {
                                if (editData != null) {
                                    setEditData(old => {
                                        old.batangAdministratif = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>3. Tanggapan Penjelasan Substantif</b></label>
                        <Editor
                            initialValue={editData?.penjelasanSubstantif ?? ""}
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
                                    'removeformat | help',
                                placeholder: `Tanggapan substantif: tanggapan yang bersifat mengubah isi atau pokok inti atau makna dari bagian tubuh dan/atau penjelasan peraturan. Contoh: memperjelas kriteria Lembaga penunjang dan jenis LP yang dimaksud. Apakah termasuk Lembaga pengayom?`
                            }}
                            onEditorChange={(content, editor) => {
                                if (editData != null) {
                                    setEditData(old => {
                                        old.penjelasanSubstantif = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>2. Tanggapan Penjelasan Administratif</b></label>
                        <Editor
                            initialValue={editData?.penjelasanAdministratif ?? ""}
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
                                    'removeformat | help',
                                placeholder: `Tanggapan administratif: tanggapan terhadap ejaan, tata bahasa, peristilahan, singkatan, dan kesalahan penulisan kata yang tidak mempengaruhi makna bagian tubuh dan penjelasan peraturan
                                    Contoh:
                                    istilah “selain produktif” diganti “non produktif”.`
                            }}
                            onEditorChange={(content, editor) => {
                                if (editData != null) {
                                    setEditData(old => {
                                        old.penjelasanAdministratif = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>5. Usulan Perubahan Batang Tubuh</b></label>
                        <Editor
                            initialValue={editData?.usulanPerubahanBatangTubuh ?? ""}
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
                                        old.usulanPerubahanBatangTubuh = content
                                        return old;
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='ms-2'><b>6. Usulan Perubahan Penjelasan</b></label>
                        <Editor
                            initialValue={editData?.usulanPerubahanPenjelasan ?? ""}
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
                                        old.usulanPerubahanPenjelasan = content
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
                                <div className='d-flex'>
                                    <button className='my-auto btn btn-primary' type='submit'>Simpan Tanggapan</button>
                                </div>
                            </div>
                        </form>
                        <div className='table-responsive mt-4'>
                            <table className='table mt-2'>
                                <thead>
                                    <tr className='bg-merah-gelap text-white'>
                                        <td style={{ width: '4%', }}>Aksi</td>
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
                                    {baris.map((row, index) => (
                                        <tr key={`baris-${index}`}>
                                            <td>
                                                {row.dapatDitanggapi ? responseBaris.filter(x => x.barisId == row.id).length > 0 ?
                                                    <div className='d-flex'>
                                                        <button title='Ubah Tanggapan' className='p-1 btn btn-success d-flex text-white me-1' onClick={() => {
                                                            setEditData(
                                                                {
                                                                    batangSubstantif: responseBaris.find(x => x.barisId == row.id)?.batangSubstantif ?? "",
                                                                    batangAdministratif: responseBaris.find(x => x.barisId == row.id)?.batangAdministratif ?? "",
                                                                    penjelasanSubstantif: responseBaris.find(x => x.barisId == row.id)?.penjelasanSubstantif ?? "",
                                                                    penjelasanAdministratif: responseBaris.find(x => x.barisId == row.id)?.penjelasanAdministratif ?? "",
                                                                    usulanPerubahanBatangTubuh: responseBaris.find(x => x.barisId == row.id)?.usulanPerubahanBatangTubuh ?? "",
                                                                    usulanPerubahanPenjelasan: responseBaris.find(x => x.barisId == row.id)?.usulanPerubahanPenjelasan ?? "",
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
                                                        <button title='Tambah Tanggapan' className='p-1 btn btn-primary d-flex text-white me-1' onClick={() => {
                                                            setEditData(
                                                                {
                                                                    batangSubstantif: "",
                                                                    batangAdministratif: "",
                                                                    penjelasanSubstantif: "",
                                                                    penjelasanAdministratif: "",
                                                                    usulanPerubahanBatangTubuh: "",
                                                                    usulanPerubahanPenjelasan: "",
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
                                            <td>{(index + 1)}</td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: row.tubuh }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: row.penjelasan }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.batangSubstantif ?? "-" }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.batangAdministratif ?? "-" }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.penjelasanSubstantif ?? "-" }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.penjelasanAdministratif ?? "-" }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.usulanPerubahanBatangTubuh ?? "-" }} />
                                            </td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: responseBaris.find(x => x.barisId == row.id)?.usulanPerubahanPenjelasan ?? "-" }} />
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
