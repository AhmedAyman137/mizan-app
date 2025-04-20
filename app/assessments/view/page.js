"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "./view.module.css";
import { getAssessments, deleteAssessment } from "../../services.js";
import Header from "../../../components/Header";

export default function ViewAssessmentsPage() {
    const [assessments, setAssessments] = useState([]);
    const [error, setError] = useState("");
    const [role, setRole] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    useEffect(() => {
        const r = localStorage.getItem("userRole");
        setRole(r || "");
        getAssessments()
            .then(setAssessments)
            .catch((e) => {
                console.error(e);
                setError("Load failed.");
            });
    }, []);

    const courses = useMemo(
        () => [...new Set(assessments.map((a) => a.course))].sort(),
        [assessments]
    );
    const types = useMemo(
        () => [...new Set(assessments.map((a) => a.type))].sort(),
        [assessments]
    );

    const filtered = useMemo(
        () =>
            assessments.filter(
                (a) =>
                    (!courseFilter || a.course === courseFilter) &&
                    (!typeFilter || a.type === typeFilter)
            ),
        [assessments, courseFilter, typeFilter]
    );

    const handleDelete = async (id) => {
        try {
            await deleteAssessment(id);
            setAssessments((prev) => prev.filter((a) => a.id !== id));
        } catch {
            setError("Delete failed.");
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Assessments</h2>
                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.filterGroup}>
                        <label>
                            Course:
                            <select
                                value={courseFilter}
                                onChange={(e) => setCourseFilter(e.target.value)}
                            >
                                <option value="">All</option>
                                {courses.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Type:
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="">All</option>
                                {types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Due Date</th>
                                    <th>Effort</th>
                                    <th>Weight</th>
                                    {role === "teacher" && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((a) => (
                                    <tr key={a.id}>
                                        <td>{a.course}</td>
                                        <td>{a.type}</td>
                                        <td>{a.title}</td>
                                        <td>{a.dueDate}</td>
                                        <td>{a.effortHours}</td>
                                        <td>{a.weight}</td>
                                        {role === "teacher" && (
                                            <td>
                                                <Link href={`/assessments/edit?id=${a.id}`}>Edit</Link> |{" "}
                                                <button onClick={() => handleDelete(a.id)}>Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {role === "teacher" && (
                        <div className={styles.linkWrapper}>
                            <Link href="/assessments/add">Add New Assessment</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
