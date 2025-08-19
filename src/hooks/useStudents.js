import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { saveAs } from 'file-saver';

export function useStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async (params = { page: 0, size: 100 }) => {
        setLoading(true);
        try {
            const { data } = await api.get('/students', { params });
            setStudents(data.content);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const add = useCallback(async () => {
        setLoading(true);
        try {
            await api.post('/students', { firstName: '', lastName: '', marks: 0 });
            await load();
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [load]);

    const update = useCallback(async (id, payload) => {
        setLoading(true);
        try {
            await api.put(`/students/${id}`, payload);
            await load();
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [load]);

    const remove = useCallback(async (id) => {
        setLoading(true);
        try {
            await api.delete(`/students/${id}`);
            await load();
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [load]);

    const create = useCallback(async (student) => {
        setLoading(true);
        try {
            await api.post('/students', student);
            await load();
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [load]);

    const downloadTemplate = useCallback(async () => {
        const resp = await api.get('/students/template', { responseType: 'blob' });
        saveAs(resp.data, 'Student_Template.xlsx');
    }, []);

    const bulkUpload = useCallback(async (file) => {
        const form = new FormData();
        form.append('file', file);
        await api.post('/students/bulk/upload', form);
        await load();
    }, [load]);

    const downloadMarks = useCallback(async (rollNo) => {
        const resp = await api.get(`/students/marksheets/${rollNo}/download`, { responseType: 'blob' });
        saveAs(resp.data, `marksheet_${rollNo}.xlsx`);
    }, []);
    // Download marksheet template (English, Science, Maths)
    const downloadMarksTemplate = useCallback(async () => {
        const resp = await api.get('/students/marksheet/template', { responseType: 'blob' });
        saveAs(resp.data, 'Marks_Template.xlsx');
    }, []);
    // Upload filled marksheet template for a student
    const uploadMarksTemplate = useCallback(async (studentId, file) => {
        const form = new FormData();
        form.append('file', file);
        await api.post(`/students/${studentId}/marksheet/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        await load();
    }, [load]);
    // Download persisted marksheet generated from uploaded template
    const downloadMarksheet = useCallback(async (studentId) => {
        const resp = await api.get(`/students/${studentId}/marksheet/download`, { responseType: 'blob' });
        saveAs(resp.data, `Marksheet_${studentId}.xlsx`);
    }, []);
    const uploadMarks = useCallback(async (rollNo, file) => {
        const form = new FormData();
        form.append('file', file);
        await api.post(`/students/${rollNo}/marks/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        await load();
    }, [load]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        students, loading, error, add, create, update, remove, downloadTemplate, bulkUpload,
        downloadMarks, uploadMarks,
        downloadMarksTemplate, uploadMarksTemplate, downloadMarksheet
    };
}
