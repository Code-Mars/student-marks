import { useState, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import * as XLSX from 'xlsx';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

function App() {
  const [students, setStudents] = useState([]);
  const [counter, setCounter] = useState(1);
  const toast = useRef(null);
  const fileInput = useRef(null);
  // global search
  const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ FirstName: '', LastName: '', Marks: '' }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'Student_Template.xlsx');
    toast.current.show({ severity: 'success', summary: 'Template Downloaded', detail: 'Excel template downloaded.', life: 3000 });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      const newData = data.map((row, idx) => ({
        rollNo: counter + idx,
        firstName: row.FirstName || '',
        lastName: row.LastName || '',
        marks: row.Marks || 0
      }));
      setStudents(prev => [...prev, ...newData]);
      setCounter(counter + newData.length);
      toast.current.show({ severity: 'success', summary: 'Upload Successful', detail: `${newData.length} records added.`, life: 3000 });
    };
    reader.readAsBinaryString(file);
  };

  const addRow = () => {
    setStudents(prev => [...prev, { rollNo: counter, firstName: '', lastName: '', marks: 0 }]);
    setCounter(counter + 1);
  };

  const onCellEdit = (options, field, value) => {
    const list = [...students];
    list[options.rowIndex][field] = value;
    setStudents(list);
  };

  const downloadMarks = (rollNo) => {
    // TODO: implement downloading marksheet for rollNo
  };

  const deleteRow = (rowData) => {
    setStudents(prev => prev.filter(s => s.rollNo !== rowData.rollNo));
    toast.current.show({ severity: 'info', summary: 'Deleted', detail: `Roll ${rowData.rollNo} removed`, life: 3000 });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters.global.value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onCellEditComplete = (e) => {
    let updated = [...students];
    updated[e.rowIndex][e.field] = e.newValue;
    setStudents(updated);
    toast.current.show({
      severity: 'success',
      summary: 'Updated',
      detail: `Row ${updated[e.rowIndex].rollNo} saved`,
      life: 2000
    });
  };

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="m-0">📘 Student Marksheet Manager</h4>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search students" />
        </span>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <Toast ref={toast} />
      <DataTable
        value={students}
        header={
          <div className="d-flex justify-content-between align-items-center p-2 bg-primary text-white">
            <h4 className="m-0 text-white">📘 Student Marksheet Manager</h4>
            <div className="d-flex align-items-center">
              <span className="p-input-icon-left me-3">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search students" className="p-inputtext-sm" />
              </span>
              <Button label="Download Template" icon="pi pi-download" className="me-2 p-button-sm" onClick={downloadTemplate} />
              <Button icon="pi pi-upload" className="p-button-sm p-button-outlined me-2" onClick={() => fileInput.current.click()} />
              <input ref={fileInput} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} hidden />
              <Button label="Add Row" icon="pi pi-plus" className="p-button-sm p-button-success" onClick={addRow} />
            </div>
          </div>
        }
        filters={filters}
        globalFilterFields={["firstName", "lastName", "rollNo"]}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}
        sortMode="multiple"
        editMode="cell"
        onCellEditComplete={onCellEditComplete}
        className="mt-3"
      >
        <Column field="rollNo" header="Roll No" sortable filter />
        <Column field="firstName" header="First Name"
          editor={(opt) => (
            <input type="text" defaultValue={opt.value} className="form-control"
              onBlur={(e) => opt.editorCallback(e.target.value)} />
          )}
          sortable filter
        />
        <Column field="lastName" header="Last Name"
          editor={(opt) => (
            <input type="text" defaultValue={opt.value} className="form-control"
              onBlur={(e) => opt.editorCallback(e.target.value)} />
          )}
          sortable filter
        />
        <Column field="marks" header="Marks"
          editor={(opt) => (
            <input type="number" defaultValue={opt.value} className="form-control"
              onBlur={(e) => opt.editorCallback(Number(e.target.value))} />
          )}
          sortable filter
        />
        <Column header="Actions" body={(rowData) => (
          <div className="d-flex gap-2">
            <Button icon="pi pi-cloud-download" className="p-button-sm p-button-info" onClick={() => downloadMarks(rowData.rollNo)} />
            <Button icon="pi pi-trash" className="p-button-sm p-button-danger" onClick={() => deleteRow(rowData)} />
          </div>
        )} />
      </DataTable>
    </div>
  );
}

export default App;
