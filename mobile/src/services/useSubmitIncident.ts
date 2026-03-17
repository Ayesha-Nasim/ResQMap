import { api } from "./api";

export async function submitIncidentAPI(formData: FormData) {
  try {
    const response = await api.post("/incidents/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (err: any) {
    console.log("SUBMIT INCIDENT ERROR:", err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}
