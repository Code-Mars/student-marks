import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentGrid = () => {
    const [students, setStudents] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        loadStudents({ page: 0, size: 10 });
    }, []);

    const loadStudents = async (params) => {
        try {
            const res = await api.get('/students', { params });
            setStudents(res.data.content);
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
        }
    };

    const onCellEditComplete = async (e) => {
        const { newValue, rowData, field } = e;
        const updated = { ...rowData, [field]: newValue };
        try {
            const res = await api.put(`/students/${rowData.id}`, updated);
            toast.current.show({ severity: 'success', summary: 'Saved', detail: `${field} updated` });
            loadStudents({ page: 0, size: 10 });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: err.response?.data?.messages?.join(', ') || err.message });
        }
    };

    const cellEditor = (field) => (options) => {
        return (
            <input type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} className="form-control" />
        );
    };

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <Toolbar className="mb-2" left={() => <h3>Student Marksheet</h3>} />
            <DataTable value={students} paginator rows={10} editMode="cell" onCellEditComplete={onCellEditComplete}>
                <Column field="rollNumber" header="Roll No" sortable />
                <Column field="firstName" header="First Name" editor={cellEditor('firstName')} sortable />
                <Column field="lastName" header="Last Name" editor={cellEditor('lastName')} sortable />
                <Column field="marks" header="Marks" editor={cellEditor('marks')} sortable />
            </DataTable>
        </div>
    );
};

export default StudentGrid;
