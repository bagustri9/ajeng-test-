import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function App() {
  const [data, setData] = useState([]);
  const [pilihInstansi, setPilihInstansi] = useState("");
  const [pilihPasal, setPilihPasal] = useState("0");

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // When file is read
    reader.onload = (event) => {
      const data = event.target.result;

      // Use XLSX to read the binary string
      const workbook = XLSX.read(data, { type: 'binary' });

      // Get the first sheet from the workbook
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const namaCell = sheet['B1'];
      var nama = "";
      if (namaCell) {
        nama = namaCell.v
      }

      // Convert the sheet to JSON
      var json = XLSX.utils.sheet_to_json(sheet, {
        range: 1,
        header: 1
      });

      const headers = json[0];

      // Remove the header row and process the rest of the data
      const processedData = json.slice(1).map((row) => {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        rowData["tipe"] = rowData.tanggapan.includes("?") ? "pertanyaan" : "pernyataan";
        return rowData;
      });
      setData(old => {
        var oldData = [...old];
        var newData = { name: nama, data: processedData }
        if (old.filter(x => x.name == nama).length > 0) {
          oldData = old.filter(x => x.name != nama);
        }
        if (oldData.length == 0) {
          return [newData];
        }
        return [...oldData, newData];
      })
    };

    // Read the file as binary string
    reader.readAsBinaryString(file);
  };

  return (
    <div className='col-8 offset-2 mt-4 card p-4 shadow-sm'>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className='mb-4' />
      <div className='card p-4 mt-4'>
        <select class="form-select" defaultValue={"Pilih Instansi"} onChange={(e) => setPilihInstansi(e.target.value)}>
          <option value="Pilih Instansi" disabled>Pilih Instansi</option>
          {data.map(x => (
            <option value={x.name}>{x.name}</option>
          ))}
        </select>
        <table class="table table-striped">
          <thead>
            <tr>
              <td>Pasal</td>
              <td>Tanggapan</td>
              <td>Tipe</td>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.filter(x => x.name == pilihInstansi).length > 0 ? data.find(x => x.name == pilihInstansi).data.map(x => (
              <tr>
                <td>{x.pasal}</td>
                <td>{x.tanggapan}</td>
                <td>{x.tipe}</td>
              </tr>
            )) : null : null}
          </tbody>
        </table>
      </div>
      <div className='card p-4 mt-4'>
        <select class="form-select" defaultValue={"Pilih Pasal"} onChange={(e) => setPilihPasal(e.target.value)}>
          <option value="Pilih Pasal" disabled>Pilih Pasal</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
        </select>
        <table class="table table-striped">
          <thead>
            <tr>
              <td>Nama</td>
              <td>Pasal</td>
              <td>Tanggapan</td>
              <td>Respon</td>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map(x => (
              x.data.filter(y => y.pasal == pilihPasal).length == 0 ? null :
                <tr>
                  <td>{x.name}</td>
                  <td>{pilihPasal}</td>
                  <td>{x.data.find(y => y.pasal == pilihPasal).tanggapan}</td>
                  <td>{x.data.find(y => y.pasal == pilihPasal).tipe}</td>
                </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
