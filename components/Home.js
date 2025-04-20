"use client";

import { useRouter } from "next/navigation";
import styles from "./HomeButton.module.css";

export default function HomeButton() {
    const router = useRouter();

    return (
        <div className={styles.wrapper}>
            <button onClick={() => router.push("/dashboard")} className={styles.button}>
                🏠 Home
            </button>
        </div>
    );
}
