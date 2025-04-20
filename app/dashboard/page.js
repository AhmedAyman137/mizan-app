"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import Header from "../../components/Header";

export default function DashboardPage() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        setRole(storedRole);
    }, []);

    if (!role) return <p>Loading...</p>;

    const teacherCards = [
        { title: "Add Assessment", link: "/assessments/add", description: "Create a new assessment" },
        { title: "Edit Assessment", link: "/assessments/edit", description: "Update existing assessments" },
        { title: "Delete Assessment", link: "/assessments/delete", description: "Remove an assessment" },
        { title: "View Assessments", link: "/assessments/view", description: "View all assessments" }
    ];

    const studentCards = [
        { title: "View Assessments", link: "/assessments/view", description: "View your assessments" },
        { title: "Workload Summary", link: "/assessments/workload", description: "Check your workload" }
    ];

    const cards = role === "teacher" ? teacherCards : studentCards;

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.dashboardCard}>
                    <h2>Dashboard</h2>
                    <div className={styles.cardsWrapper}>
                        {cards.map((card) => (
                            <Link key={card.title} href={card.link} className={styles.card}>
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
