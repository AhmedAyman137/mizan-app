"use client";

import { useEffect, useState } from "react";
import styles from "./delete.module.css";
import Header from "../../../components/Header";
import {
    getAssessments,
    deleteAssessment,
} from "../../services.js";

export default function DeleteAssessmentPage() {
    const [assessments, setAssessments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getAssessments().then(setAssessments).catch(() => {
            setMessage("Failed to load assessments.");
        });
    }, []);

    const toggleSelection = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selectedIds.map((id) => deleteAssessment(id)));
            setAssessments((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
            setSelectedIds([]);
            setShowModal(false);
            setMessage("Selected assessments deleted successfully.");
        } catch (err) {
            console.error("Delete error:", err);
            setMessage("Failed to delete selected assessments.");
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Delete Assessments</h2>

                    <button onClick={() => setShowModal(true)} className={styles.deleteButton}>
                        Select Assessments to Delete
                    </button>

                    {message && <p className={styles.message}>{message}</p>}
                </div>
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Select assessments to delete</h3>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Course</th>
                                        <th>Type</th>
                                        <th>Title</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assessments.map((a) => (
                                        <tr key={a.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(a.id)}
                                                    onChange={() => toggleSelection(a.id)}
                                                />
                                            </td>
                                            <td>{a.course}</td>
                                            <td>{a.type}</td>
                                            <td>{a.title}</td>
                                            <td>{a.dueDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.modalActions}>
                            <button onClick={handleDelete} className={styles.confirmButton}>
                                Delete Selected
                            </button>
                            <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
