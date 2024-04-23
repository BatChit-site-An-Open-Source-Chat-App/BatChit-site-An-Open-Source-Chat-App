import axios from "axios"
import { usersBackendURL } from "../utils/usersBackendURL"

export const getSearchedUser = async (userId: string) => {
    const response = await axios.get(`${usersBackendURL}/get-user-with-id/${userId}`)

    const { data, statusCode, success } = response.data

    if (success && statusCode === 200) {
        return data
    }
}