import axios from "axios";
import { usersBackendURL } from "../utils/usersBackendURL";
const accessToken = document.cookie.match('accessToken=')
export const login = async () => {
    try {
        if (accessToken) {
            const response = await axios.post(`${usersBackendURL}/login-with-token`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Set Authorization header with access token
                },
            });
            const { success, statusCode, data } = response.data
            if (success && statusCode === 200) {
                return { success, user: data.user }
            } else {
                return { success: false }
            }
        }
        else {
            return { success: false }
        }
    } catch (error) {
        return { success: false }
    }
};
