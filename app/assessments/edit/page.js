"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./edit.module.css";
import {
    getAssessment,
    updateAssessment
} from "../../services.js";

export default function EditAssessmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [assessment, setAssessment] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        getAssessment(id)
            .then(setAssessment)
            .catch(() => {
                setError("Assessment not found.");
                router.push("/assessments/view");
            });
    }, [id, router]);

    const handleChange = (e) => {
        setAssessment({
            ...assessment,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAssessment(id, assessment);
            router.push("/assessments/view");
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to save changes.");
        }
    };

    if (!assessment) return <p>Loading...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Edit Assessment</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Course:</label>
                        <input
                            type="text"
                            name="course"
                            value={assessment.course}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Type:</label>
                        <select
                            name="type"
                            value={assessment.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Homework">Homework</option>
                            <option value="Quiz">Quiz</option>
                            <option value="Midterm">Midterm</option>
                            <option value="Final">Final</option>
                            <option value="Project">Project</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={assessment.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Due Date:</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={assessment.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Effort Hours:</label>
                        <input
                            type="number"
                            name="effortHours"
                            value={assessment.effortHours}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Weight (%):</label>
                        <input
                            type="number"
                            name="weight"
                            value={assessment.weight}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {assessment.type === "Project" && (
                        <div className={styles.formGroup}>
                            <label>Project Phase (1-4):</label>
                            <input
                                type="number"
                                name="projectPhase"
                                value={assessment.projectPhase}
                                onChange={handleChange}
                                min="1"
                                max="4"
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className={styles.submitButton}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
