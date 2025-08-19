import api from './api';
import { saveAs } from 'file-saver';

export const getStudents = (params) => {
    return api.get('/students', { params });
};

export const createStudent = (student) => {
    return api.post('/students', student);
};

export const updateStudent = (id, student) => {
    return api.put(`/students/${id}`, student);
};

export const deleteStudent = (id) => {
    return api.delete(`/students/${id}`);
};

export const downloadTemplate = () => {
    return api.get('/students/template', { responseType: 'blob' })
        .then(response => {
            saveAs(response.data, 'Student_Template.xlsx');
        });
};

export const bulkUploadStudents = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/students/bulk/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const downloadMarksSheet = (rollNo) => {
    return api.get(`/students/marksheets/${rollNo}/download`, { responseType: 'blob' })
        .then(response => {
            saveAs(response.data, `marksheet_${rollNo}.xlsx`);
        });
};

export const uploadMarks = (rollNo, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/students/${rollNo}/marks/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
