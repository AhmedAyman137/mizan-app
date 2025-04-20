"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./add.module.css";
import {
    createAssessment,
    getAssessments,
} from "../../services.js";

export default function AddAssessmentPage() {
    const router = useRouter();

    const [assessment, setAssessment] = useState({
        course: "",
        type: "",
        title: "",
        dueDate: "",
        effortHours: "",
        weight: "",
        projectPhase: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setAssessment({
            ...assessment,
            [e.target.name]: e.target.value,
        });
    };

    const generateTitle = async () => {
        if (!assessment.course.trim()) return assessment.type;
        try {
            const all = await getAssessments();
            const same = all.filter(
                (a) => a.course === assessment.course && a.type === assessment.type
            );
            return same.length === 0
                ? assessment.type
                : `${assessment.type} ${same.length + 1}`;
        } catch {
            return assessment.type;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (assessment.type === "Midterm") {
            try {
                const all = await getAssessments();
                const mids = all.filter(
                    (a) => a.course === assessment.course && a.type === "Midterm"
                );
                if (mids.length >= 2) {
                    setError("You can only add 2 midterms per course.");
                    return;
                }
            } catch (err) {
                setError("Failed to validate midterms.");
                return;
            }
        }

        if (!assessment.title.trim()) {
            assessment.title = await generateTitle();
        }

        try {
            await createAssessment(assessment);
            router.push("/assessments/view");
        } catch (err) {
            console.error("Error adding assessment:", err);
            setError("There was an error adding the assessment. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Add Assessment</h2>
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
                            placeholder="(Leave blank to auto-generate)"
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


                    {error && <p style={{ color: "red" }}>{error}</p>}


                    <button type="submit" className={styles.submitButton}>
                        Add Assessment
                    </button>
                </form>
            </div>
        </div>
    );
}
