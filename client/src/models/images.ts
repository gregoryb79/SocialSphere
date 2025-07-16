
export async function uploadToImgbb(file: File): Promise<string> {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const apiUrl = import.meta.env.VITE_IMGBB_UPLOAD_URL;
    console.log(`Using IMGBB API key: ${apiKey} and URL: ${apiUrl}`);
    if (!apiKey || !apiUrl) {
        throw new Error("IMGBB API key or URL is not defined in environment variables");
    }
    const formData = new FormData();
    formData.append("image", file);

    try {
        console.log("Uploading file to IMGBB:", file.name);
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.data.url || "";
    }catch (error) {
        console.error("Error uploading to IMGBB:", error);
        throw new Error("Failed to upload image to IMGBB");
    }
}