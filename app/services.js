const url = "https://67f57b0e913986b16fa4b9e7.mockapi.io/assessments";

export async function getAssessments() {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch assessments");
    return res.json();
}

export async function getAssessment(id) {
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch assessment ${id}`);
    return res.json();
}

export async function createAssessment(data) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add assessment");
    return res.json();
}

export async function updateAssessment(id, data) {
    const res = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update assessment ${id}`);
    return res.json();
}

export async function deleteAssessment(id) {
    const res = await fetch(`${url}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete assessment ${id}`);
    return res.json();
}
