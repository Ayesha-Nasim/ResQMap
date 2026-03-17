import { api } from "./api";

export async function uploadIncidentAPI(formData: FormData) {
  try {
    const base = api.defaults.baseURL; 
    const uploadUrl = `${base}/incidents/submit`;

    console.log("🚀 Uploading to:", uploadUrl);

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const json = await response.json();
    return json;

  } catch (err: any) {
    console.log("UPLOAD ERROR:", err);
    return { success: false, error: err.message };
  }
}
