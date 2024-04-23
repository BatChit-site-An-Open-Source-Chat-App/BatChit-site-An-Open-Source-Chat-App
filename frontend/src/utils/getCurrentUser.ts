import axios from "axios";
import { usersBackendURL } from "./usersBackendURL";

export const getCurrentUser = async () => {
    const access_Token = document.cookie.match('accessToken=')

    // Get the current user
    const getUser = await axios.get(`${usersBackendURL}/current-user`, {
        headers: {
            Authorization: `Bearer ${access_Token}`,
        },
    });
    return getUser.data
}