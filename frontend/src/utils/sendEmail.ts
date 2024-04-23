import axios from "axios"
import { usersBackendURL } from "./usersBackendURL"
import { getCurrentUser } from "./getCurrentUser"

type EMAIL_DATA_TYPES = "ACCOUNT_ACTIVATION"

// type, to
export const sendEmail = async (type: EMAIL_DATA_TYPES) => {
    try {
        const getUser = await getCurrentUser()
        const { success, statusCode, data } = getUser

        if (!success) {
            return { success: false }
        }
        if (success && statusCode === 200) {
            const response = await axios.post(`${usersBackendURL}/send-activation-email`, { type: type, email: data.email })
            const { success, statusCode, code } = response.data
            if (success && statusCode === 200) {
                return { success, code }
            }
            return { success: false }
        }
        return { success: false }

    } catch (error: any) {
        return { success: false, msg: error?.message || 'Something went wrong' }
    }
}
