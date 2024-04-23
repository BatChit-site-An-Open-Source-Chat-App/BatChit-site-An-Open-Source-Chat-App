import axios from "axios"
import { usersBackendURL } from "../utils/usersBackendURL"

export const updateAccount = async (fullName: string, bio?: string) => {
    try {
        const response = await axios.patch(`${usersBackendURL}/update-account`, { fullName, bio })
        const { success, statusCode, data } = response.data
        if (success && statusCode === 200) {
            return { success, data }
        }
        return { success: false }
    } catch (error: any) {
        return { success: false, msg: error?.message || error };
    }
}   