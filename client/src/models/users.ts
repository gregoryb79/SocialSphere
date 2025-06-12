import { apiClient } from "./apiClient";

export async function getUsers() {
    try {
        const response = await apiClient.get("/users");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}