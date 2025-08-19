import { useState, useRef, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Use a light PrimeReact theme for clarity
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { FilterMatchMode } from 'primereact/api';
import { useStudents } from './hooks/useStudents';

function App() {
  const toast = useRef(null);
  const fileInput = useRef(null);
  const marksheetInput = useRef(null);
  const dt = useRef(null);
  const { students, loading, error, create, update: updateBackend, remove,
    downloadTemplate, bulkUpload,
    downloadMarksTemplate, uploadMarksTemplate, downloadMarksheet
  } = useStudents();
  // combine hook data into table data
  const [data, setData] = useState([]);
  useEffect(() => { setData(students); }, [students]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    rollNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    marks: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, global: { value, matchMode: FilterMatchMode.CONTAINS } }));
    setGlobalFilterValue(value);
  };
  // Clear global search filter
  const clearGlobalFilter = () => {
    setFilters(prev => ({ ...prev, global: { value: null, matchMode: FilterMatchMode.CONTAINS } }));
    setGlobalFilterValue('');
  };

  const showErrors = (err) => {
    const msgs = err.response?.data?.errors || [err.message];
    msgs.forEach(msg => toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 4000 }));
  };
  const onFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      bulkUpload(file)
        .then(() => toast.current.show({ severity: 'success', summary: 'Upload', detail: 'Bulk upload complete', life: 2000 }))
        .catch(err => toast.current.show({ severity: 'error', summary: 'Upload', detail: err.message, life: 3000 }));
    }
  };

  // Add a blank row and start editing it
  const handleAdd = () => {
    const newRow = { id: `tmp-${Date.now()}`, rollNumber: '', firstName: '', lastName: '', marks: 0 };
    setData(prev => [newRow, ...prev]);
    setTimeout(() => dt.current.initRowEdit(newRow), 0);
  };

  // Save a new local row to backend
  const handleSave = (row) => {
    create({ firstName: row.firstName, lastName: row.lastName, marks: row.marks })
      .then(() => {
        toast.current.show({ severity: 'success', summary: 'Saved', detail: 'New student saved', life: 2000 });
        setData(prev => prev.filter(r => r.id !== row.id));
      })
      .catch(err => showErrors(err));
  };

  // Cancel adding a local row
  const handleCancel = (id) => {
    setData(prev => prev.filter(r => r.id !== id));
  };

  // Allow row editing only for temporary rows
  const allowEdit = (rowData) => rowData.id.toString().startsWith('tmp-');

  // Handle completion of row editing
  const onRowEditComplete = (e) => {
    const { newData } = e;
    if (allowEdit(newData)) {
      // create new student
      create({ firstName: newData.firstName, lastName: newData.lastName, marks: newData.marks })
        .then(() => toast.current.show({ severity: 'success', summary: 'Saved', detail: 'New student saved', life: 2000 }))
        .catch(err => showErrors(err));
    } else {
      // update existing
      updateBackend(newData.id, { firstName: newData.firstName, lastName: newData.lastName, marks: newData.marks })
        .then(() => toast.current.show({ severity: 'success', summary: 'Updated', detail: `Roll ${newData.rollNumber} updated`, life: 2000 }))
        .catch(err => showErrors(err));
    }
  };

  // Cancel row editing: remove tmp row
  const onRowEditCancel = (e) => {
    const cancelled = e.data;
    if (allowEdit(cancelled)) {
      setData(prev => prev.filter(d => d.id !== cancelled.id));
    }
  };

  // Download marksheet via direct link to leverage browser streaming
  const handleDownloadMarks = (rollNumber) => {
    const base = import.meta.env.VITE_API_BASE_URL || '';
    const url = `${base}/students/marksheets/${rollNumber}/download`;
    window.open(url, '_blank');
  };

  const handleDelete = (id, rollNumber) => {
    remove(id)
      .then(() => toast.current.show({ severity: 'info', summary: 'Deleted', detail: `Roll ${rollNumber} removed`, life: 2000 }))
      .catch(err => toast.current.show({ severity: 'error', summary: 'Delete', detail: err.message, life: 3000 }));
  };
  // Marksheet template upload state
  const [marksheetUploadTarget, setMarksheetUploadTarget] = useState(null);

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center">
      <h4 className="m-0 text-black">📘 Student Marksheet Manager</h4>
      <div className="d-flex align-items-center">
        <span className="p-input-icon-left me-3">
          {/* Move icon inward and increase input padding */}
          <i className="pi pi-search ms-2" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search students"
            className="p-inputtext-sm ps-5"
          />
        </span>
        <Button label="Download Template" icon="pi pi-download" className="me-2 p-button-sm" onClick={downloadTemplate} />
        <Button label="Download Marks Template" icon="pi pi-download" className="me-2 p-button-sm" onClick={downloadMarksTemplate} />
        <Button icon="pi pi-upload" className="p-button-sm text-black p-button-outlined me-2 bulk-upload-btn" onClick={() => fileInput.current.click()} />
        <input ref={fileInput} type="file" accept=".xlsx,.xls" onChange={onFileUpload} hidden />
        <Button label="Add Row" icon="pi pi-plus" className="p-button-sm p-button-success" onClick={handleAdd} />
        {/* Clear global filter button */}
        {globalFilterValue && (
          <Button icon="pi pi-times" className="p-button-sm p-button-danger" onClick={clearGlobalFilter} />
        )}
      </div>
    </div>
  );

  return (
    <div className="p-0 m-0" style={{ width: '100vw', height: '100vh' }}>

      <Toast ref={toast} />
      {/* Tooltips for icon-only buttons */}
      <Tooltip target=".bulk-upload-btn" content="Bulk upload students" position="bottom" />
      <Tooltip target=".row-upload-btn" content="Upload marksheet" position="bottom" />
      <Tooltip target=".row-download-btn" content="Download marksheet" position="bottom" />
      <Tooltip target=".row-delete-btn" content="Delete student" position="bottom" />
      <input ref={marksheetInput} type="file" accept=".xlsx,.xls" hidden onChange={(e) => {
        const file = e.target.files[0];
        if (file && marksheetUploadTarget) {
          uploadMarksTemplate(marksheetUploadTarget.id, file)
            .then(() => {
              toast.current.show({ severity: 'success', summary: 'Uploaded', detail: 'Marks template uploaded', life: 2000 });
              // update student row to reflect uploaded marksheet
              setData(prev => prev.map(d => d.id === marksheetUploadTarget.id ? { ...d, hasMarksheet: true } : d));
            })
            .catch(err => showErrors(err));
        }
      }} />
      <DataTable
        onFilter={(e) => setFilters(e.filters)}
        ref={dt}
        value={data}
        dataKey="id"
        loading={loading}
        header={renderHeader()}
        filters={filters}
        globalFilterFields={["firstName", "lastName", "rollNumber"]}
        paginator rows={5} rowsPerPageOptions={[5, 10, 20]}
        sortMode="multiple" editMode="row"
        onRowEditComplete={onRowEditComplete}
        onRowEditCancel={onRowEditCancel}
        className="w-100 h-100 shadow-sm"
        style={{ width: '100%', height: 'calc(100vh - 60px)' }}
      >
        <Column field="rollNumber" header="Roll No" sortable filter />
        <Column field="firstName" header="First Name" editor={(options) => (
          <InputText value={options.value || ''} onChange={(e) => options.editorCallback(e.target.value)} />
        )} sortable filter />
        <Column field="lastName" header="Last Name" editor={(options) => (
          <InputText value={options.value || ''} onChange={(e) => options.editorCallback(e.target.value)} />
        )} sortable filter />
        <Column field="marks" header="Marks" editor={(options) => (
          <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="decimal" />
        )} sortable filter />
        {/* Built-in rowEditor: edit icon and save/cancel for any row */}
        <Column rowEditor headerStyle={{ width: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
        {/* Download/Delete only for persisted rows */}
        <Column header="Actions" body={(rowData) => {
          if (rowData.id.toString().startsWith('tmp-')) return null;
          return (
            <div className="d-flex gap-2">
              {/* upload marksheet template */}
              <Button icon="pi pi-upload" className="p-button-sm p-button-help row-upload-btn" onClick={() => { setMarksheetUploadTarget(rowData); marksheetInput.current.click(); }} />
              {/* download persisted marksheet template if available */}
              {rowData.hasMarksheet && (
                <Button icon="pi pi-cloud-download" className="p-button-sm p-button-secondary row-download-btn" onClick={() => downloadMarksheet(rowData.id)} />
              )}
              <Button icon="pi pi-trash" className="p-button-sm p-button-danger row-delete-btn" onClick={() => handleDelete(rowData.id, rowData.rollNumber)} />
            </div>
          );
        }} />
      </DataTable>
    </div>
  );
}

export default App;
