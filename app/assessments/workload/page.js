"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import styles from "./work.module.css";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { getAssessments } from "../../services.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WorkloadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [workload, setWorkload] = useState({});
    const [error, setError] = useState("");

    // Step 1: Check role from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        const userRole = localStorage.getItem("userRole");
        console.log("Detected user role:", userRole);

        if (!userRole || userRole !== "student") {
            router.push("/dashboard");
        } else {
            setRole(userRole);
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!role) return;

        getAssessments()
            .then((data) => {
                const summary = data.reduce((acc, item) => {
                    acc[item.course] = (acc[item.course] || 0) + Number(item.effortHours);
                    return acc;
                }, {});
                setWorkload(summary);
            })
            .catch((err) => {
                console.error("Error fetching workload:", err);
                setError("error loading workload data.");
            });
    }, [role]);

    const chartData = {
        labels: Object.keys(workload),
        datasets: [
            {
                label: "Total Effort Hours",
                data: Object.values(workload),
                backgroundColor: "rgba(0, 112, 243, 0.6)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Workload by Course" },
        },
    };

    return (
        <>
            <Header />
            {loading ? (
                <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
            ) : (
                <div className={styles.container}>
                    <div className={styles.card}>
                        <h2>Workload Summary</h2>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        {Object.keys(workload).length === 0 ? (
                            <p>No workload data available.</p>
                        ) : (
                            <>
                                <Bar data={chartData} options={chartOptions} />
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Total Effort Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(workload).map(([course, hours]) => (
                                            <tr key={course}>
                                                <td>{course}</td>
                                                <td>{hours}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
